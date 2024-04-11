import { useApolloClient } from '@apollo/client'
import { datadogLogs } from '@datadog/browser-logs'
import { isSameDay } from 'date-fns'
import { useMemo, useState, type FormEventHandler } from 'react'
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

  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [offer, setOffer] = useState(initialOffer)
  const [startDate, setStartDate] = useState(() => getOfferStartDateWithFallback(offer))
  const [numberCoInsured, setNumberCoInsured] = useState(() =>
    getOfferNumberCoInsuredWithFallback(offer),
  )
  const isFormPristine = useMemo(() => {
    return (
      isSameDay(startDate, getOfferStartDateWithFallback(offer)) &&
      numberCoInsured === getOfferNumberCoInsuredWithFallback(offer)
    )
  }, [offer, startDate, numberCoInsured])

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    try {
      setState('loading')

      const hasNumberCosInsuredChanged =
        numberCoInsured !== getOfferNumberCoInsuredWithFallback(offer)
      if (hasNumberCosInsuredChanged) {
        const priceIntentService = priceIntentServiceInitClientSide(apolloClient)

        const priceTemplate = getPriceTemplate(productName)
        if (!priceTemplate) {
          setState('error')
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

        await priceIntentService.update({
          priceIntentId: priceIntent.id,
          data: {
            numberCoInsured,
            startDate: formatAPIDate(startDate),
          },
          customer: { shopSessionId },
        })
        const { offers } = await priceIntentService.confirm(priceIntent.id)

        const updatedOffer = offers[0]
        setOffer(updatedOffer)
        setState('idle')
        setStartDate(getOfferStartDateWithFallback(updatedOffer))
        setNumberCoInsured(getOfferNumberCoInsuredWithFallback(updatedOffer))
      } else {
        await updateStartDate({
          variables: {
            productOfferIds: [offer.id],
            startDate: formatAPIDate(startDate),
          },
          onCompleted: (data) => {
            const updatedOffer = data.productOffersStartDateUpdate.productOffers[0]
            setOffer(updatedOffer)
            setState('idle')
            setStartDate(getOfferStartDateWithFallback(updatedOffer))
            setNumberCoInsured(getOfferNumberCoInsuredWithFallback(updatedOffer))
          },
          onError: (error) => {
            datadogLogs.logger.error('Cross sell | failed to update offer startDate', { error })
            setState('error')
          },
        })
      }
    } catch (error) {
      datadogLogs.logger.error('Cross sell | failed to update offer', { error })
      setState('error')
    }
  }

  return {
    state,
    offer,
    isFormPristine,
    handleSubmit,
    // TODO: get this typed
    fieldProps: {
      [Fields.NUMBER_CO_INSURED]: {
        value: numberCoInsured,
        onChange: setNumberCoInsured,
      },
      [Fields.START_DATE]: {
        selected: startDate,
        onSelect: setStartDate,
      },
    },
  }
}

function getOfferStartDateWithFallback(offer: OfferRecommendationFragment) {
  const today = new Date()
  return convertToDate(offer.startDate) ?? today
}

function getOfferNumberCoInsuredWithFallback(offer: OfferRecommendationFragment) {
  const CO_INSURED_DATA_KEY = 'numberCoInsured'
  return parseInt(offer.priceIntentData[CO_INSURED_DATA_KEY]) || 0
}
