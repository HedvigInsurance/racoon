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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      disptach({ type: 'SUBMIT' })

      const hasNumberCoInsuredChanged =
        state[Fields.NUMBER_CO_INSURED] !== getOfferNumberCoInsuredWithFallback(state.offer)
      if (hasNumberCoInsuredChanged) {
        const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

        const priceTemplate = getPriceTemplate(productName)
        if (!priceTemplate) {
          disptach({ type: 'ERROR' })
          datadogLogs.logger.error('Cross sell | Price template not found', {
            productName,
          })
          return
        }

        const priceIntent = await priceIntentService.getOrCreate({
          shopSessionId,
          priceTemplate,
          productName,
        })

        // TODO: consilidate update and confirm into one call
        await priceIntentService.update({
          priceIntentId: priceIntent.id,
          data: { numberCoInsured: state[Fields.NUMBER_CO_INSURED] },
          customer: { shopSessionId },
        })
        const { offers } = await priceIntentService.confirm(priceIntent.id)
        const newOffer = offers[0]
        await updateStartDate({
          variables: {
            productOfferIds: [newOffer.id],
            startDate: formatAPIDate(state[Fields.START_DATE]),
          },
          onCompleted(data) {
            const updatedOffer = data.productOffersStartDateUpdate.productOffers[0]
            disptach({ type: 'REST_FORM', payload: updatedOffer })
          },
          onError(error) {
            datadogLogs.logger.error(
              'Cross sell | failed to update offer numberCoInsured/startDate',
              { error },
            )
            disptach({ type: 'ERROR' })
          },
        })
      } else {
        await updateStartDate({
          variables: {
            productOfferIds: [state.offer.id],
            startDate: formatAPIDate(state[Fields.START_DATE]),
          },
          onCompleted(data) {
            const updatedOffer = data.productOffersStartDateUpdate.productOffers[0]
            disptach({ type: 'REST_FORM', payload: updatedOffer })
          },
          onError(error) {
            datadogLogs.logger.error('Cross sell | failed to update offer startDate', { error })
            disptach({ type: 'ERROR' })
          },
        })
      }
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
  | { type: 'REST_FORM'; payload: OfferRecommendationFragment }

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
    case 'REST_FORM':
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
