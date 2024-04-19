import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { isBefore } from 'date-fns'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  useStartDateUpdateMutation,
  type OfferRecommendationFragment,
} from '@/services/graphql/generated'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import { priceIntentServiceInitClientSide } from '@/services/priceIntent/PriceIntentService'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { useAddRecommendationOfferToCart } from './useAddRecommendationOfferToCart'

const TODAY = new Date()

export enum Fields {
  NUMBER_CO_INSURED = 'numberCoInsured',
  START_DATE = 'startDate',
}

type FormInput = {
  [Fields.NUMBER_CO_INSURED]: number
  [Fields.START_DATE]: Date
}

type Params = {
  shopSessionId: string
  initialOffer: OfferRecommendationFragment
}

export function useEditCrossSellOfferForm({ shopSessionId, initialOffer }: Params) {
  const apolloClient = useApolloClient()
  const [updateStartDate] = useStartDateUpdateMutation()

  const [offer, setOffer] = useState(initialOffer)
  const [addOfferToCart] = useAddRecommendationOfferToCart({ shopSessionId })
  const { formState, handleSubmit, getFieldState, reset, control } = useForm({
    defaultValues: getDefaultValuesFromOffer(initialOffer),
    resetOptions: {
      keepDefaultValues: false,
    },
  })

  const productName = offer.product.name

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

  const onSubmit: SubmitHandler<FormInput> = async (formData) => {
    try {
      const hasNumberCoInsuredChanged = getFieldState(Fields.NUMBER_CO_INSURED).isDirty
      const hasStartDateChanged = getFieldState(Fields.START_DATE).isDirty
      const intent = hasNumberCoInsuredChanged ? 'get-price' : 'add-to-cart'

      let updatedOffer = offer
      if (intent === 'get-price') {
        updatedOffer = await getNewOffer({ numberCoInsured: formData[Fields.NUMBER_CO_INSURED] })

        if (hasStartDateChanged) {
          updatedOffer = await updateOfferStartDate(updatedOffer.id, formData[Fields.START_DATE])
        }

        reset({
          [Fields.NUMBER_CO_INSURED]: getOfferNumberCoInsuredWithFallback(updatedOffer),
          [Fields.START_DATE]: getOfferStartDateWithFallback(updatedOffer),
        })

        setOffer(updatedOffer)
      } else {
        if (hasStartDateChanged) {
          updatedOffer = await updateOfferStartDate(offer.id, formData[Fields.START_DATE])
        }

        await addOfferToCart(updatedOffer)
      }
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
      // You still want to throw the error so 'useForm' knows about it and set form status accordingly
      throw error
    }
  }

  return {
    offer,
    formState,
    handleSubmit: handleSubmit(onSubmit),
    control,
  }
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const offerStartDate = convertToDate(offer.startDate)
  if (offerStartDate === null || isBefore(offerStartDate, TODAY)) return TODAY

  return offerStartDate
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'

  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}

function getDefaultValuesFromOffer(offer: OfferRecommendationFragment): FormInput {
  return {
    [Fields.NUMBER_CO_INSURED]: getOfferNumberCoInsuredWithFallback(offer),
    [Fields.START_DATE]: getOfferStartDateWithFallback(offer),
  }
}
