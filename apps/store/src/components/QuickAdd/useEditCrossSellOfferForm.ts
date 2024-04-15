import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { isSameDay, isBefore } from 'date-fns'
import { useCallback, useReducer, type FormEventHandler } from 'react'
import {
  useStartDateUpdateMutation,
  type OfferRecommendationFragment,
} from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { convertToDate, formatAPIDate } from '@/utils/date'

export enum Fields {
  NUMBER_CO_INSURED = 'numberCoInsured',
  START_DATE = 'startDate',
}

type Params = {
  shopSessionId: string
  productName: string
  initialOffer: OfferRecommendationFragment
}

export function useEditCrossSellOfferForm({ shopSessionId, productName, initialOffer }: Params) {
  const [updateStartDate] = useStartDateUpdateMutation()
  const apolloClient = useApolloClient()
  const [state, disptach] = useFormState(initialOffer)

  const getNewOffer = async (
    data: Record<string, unknown>,
  ): Promise<OfferRecommendationFragment> => {
    const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

    const priceTemplate = getPriceTemplate(productName)
    if (!priceTemplate) {
      throw new Error(`Cross sell | Price template not found for product ${productName}`)
    }

    const priceIntent = await priceIntentService.getOrCreate({
      shopSessionId,
      priceTemplate,
      productName,
    })

    const { offers } = await priceIntentService.upddateAndConfirm({
      priceIntentId: priceIntent.id,
      data: { ...priceIntent.suggestedData, ...data },
    })

    return offers[0] as OfferRecommendationFragment
  }

  const updateOfferStartDate = async (
    offerId: string,
    startDate: Date,
  ): Promise<OfferRecommendationFragment> => {
    const { data } = await updateStartDate({
      variables: {
        productOfferIds: [offerId],
        startDate: formatAPIDate(startDate),
      },
    })

    const updatedOffer = data?.productOffersStartDateUpdate.productOffers[0]
    if (!updatedOffer) {
      throw new Error(`Cross sell | failed to update offer (${offerId}) startDate (${startDate})`)
    }

    return updatedOffer
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      disptach({ type: 'SUBMIT' })
      let updatedOffer = state.offer

      const hasNumberCoInsuredChanged =
        state[Fields.NUMBER_CO_INSURED] !== getOfferNumberCoInsuredWithFallback(updatedOffer)
      if (hasNumberCoInsuredChanged) {
        updatedOffer = await getNewOffer({ numberCoInsured: state[Fields.NUMBER_CO_INSURED] })
      }

      const hasStartDateChanged = !isSameDay(
        state[Fields.START_DATE],
        getOfferStartDateWithFallback(updatedOffer),
      )
      if (hasStartDateChanged) {
        updatedOffer = await updateOfferStartDate(updatedOffer.id, state[Fields.START_DATE])
      }

      disptach({ type: 'RESET_FORM', payload: updatedOffer })
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
      disptach({ type: 'ERROR' })
    }
  }

  const handleChangeNumberCoInsured = useCallback(
    (numberCoInsured: number) => {
      disptach({ type: 'CHANGE_NUMBER_CO_INSURED', payload: numberCoInsured })
    },
    [disptach],
  )

  const handleChangeStartDate = useCallback(
    (date: Date) => {
      disptach({ type: 'CHANGE_START_DATE', payload: date })
    },
    [disptach],
  )

  return {
    state,
    handleChangeNumberCoInsured,
    handleChangeStartDate,
    handleSubmit,
  }
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const today = new Date()
  const offerStartDate = convertToDate(offer.startDate)

  if (offerStartDate === null || isBefore(offerStartDate, today)) return today

  return offerStartDate
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'
  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}

type State = {
  offer: OfferRecommendationFragment
  [Fields.NUMBER_CO_INSURED]: number
  [Fields.START_DATE]: Date
  status: 'idle' | 'submitting' | 'error'
  isPristine: boolean
}

type Action =
  | { type: 'CHANGE_START_DATE'; payload: Date }
  | { type: 'CHANGE_NUMBER_CO_INSURED'; payload: number }
  | { type: 'SUBMIT' }
  | { type: 'ERROR' }
  | { type: 'RESET_FORM'; payload: OfferRecommendationFragment }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CHANGE_START_DATE':
      return {
        ...state,
        [Fields.START_DATE]: action.payload,
        isPristine: !hasFormChanged({
          offer: state.offer,
          numberCoInsured: state[Fields.NUMBER_CO_INSURED],
          startDate: action.payload,
        }),
      }
    case 'CHANGE_NUMBER_CO_INSURED':
      return {
        ...state,
        [Fields.NUMBER_CO_INSURED]: action.payload,
        isPristine: !hasFormChanged({
          offer: state.offer,
          numberCoInsured: action.payload,
          startDate: state[Fields.START_DATE],
        }),
      }
    case 'SUBMIT':
      return { ...state, status: 'submitting' }
    case 'ERROR':
      return { ...state, status: 'error' }
    case 'RESET_FORM':
      return {
        ...state,
        offer: action.payload,
        [Fields.NUMBER_CO_INSURED]: getOfferNumberCoInsuredWithFallback(action.payload),
        [Fields.START_DATE]: getOfferStartDateWithFallback(action.payload),
        status: 'idle',
        isPristine: true,
      }
    default:
      return state
  }
}

function getInitalState(initialOffer: OfferRecommendationFragment): State {
  return {
    offer: initialOffer,
    [Fields.NUMBER_CO_INSURED]: getOfferNumberCoInsuredWithFallback(initialOffer),
    [Fields.START_DATE]: getOfferStartDateWithFallback(initialOffer),
    status: 'idle',
    isPristine: true,
  }
}

function hasFormChanged({
  offer,
  numberCoInsured,
  startDate,
}: {
  offer: OfferRecommendationFragment
  numberCoInsured: number
  startDate: Date
}) {
  return (
    numberCoInsured !== getOfferNumberCoInsuredWithFallback(offer) ||
    !isSameDay(startDate, getOfferStartDateWithFallback(offer))
  )
}

function useFormState(initialOffer: OfferRecommendationFragment) {
  const [state, disptach] = useReducer(reducer, getInitalState(initialOffer))

  return [state, disptach] as const
}
