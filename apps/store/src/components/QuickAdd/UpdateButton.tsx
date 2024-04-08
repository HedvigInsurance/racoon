import { datadogLogs } from '@datadog/browser-logs'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Button } from 'ui'
import {
  type OfferRecommendationFragment,
  useStartDateUpdateMutation,
  usePriceIntentCreateMutation,
  usePriceIntentDataUpdateMutation,
  usePriceIntentConfirmMutation,
} from '@/services/graphql/generated'
import { formatAPIDate } from '@/utils/date'

type Props = {
  shopSessionId: string
  productName: string
  priceIntentData: any
  startDate: Date
  numberCoInsured: number
  onUpdate?: (offer: OfferRecommendationFragment) => void
} & Omit<ComponentProps<typeof Button>, 'children' | 'onClick'>

export function UpdateButton(props: Props) {
  const {
    shopSessionId,
    productName,
    priceIntentData,
    startDate,
    numberCoInsured,
    onUpdate,
    ...buttonProps
  } = props
  const { t } = useTranslation('cart')
  const [editOffer, isLoading] = useEditOffer({
    shopSessionId,
    productName,
    startDate,
    data: {
      ...priceIntentData,
      numberCoInsured: numberCoInsured,
    },
  })

  const handleEditOffer = async () => {
    const offer = await editOffer()
    if (offer) {
      onUpdate?.(offer)
    }
  }

  return (
    <Button size="medium" {...buttonProps} onClick={handleEditOffer} loading={isLoading}>
      {t('QUICK_ADD_UPDATE')}
    </Button>
  )
}

type Params = {
  shopSessionId: string
  productName: string
  startDate: Date
  data: Record<string, unknown>
}

function useEditOffer(params: Params) {
  const [createPriceIntent, createPriceIntentResult] = usePriceIntentCreateMutation()
  const [updatePriceIntent, updatePriceIntentResult] = usePriceIntentDataUpdateMutation()
  const [confirmPriceIntent, confirmPriceIntentResult] = usePriceIntentConfirmMutation()
  const [updateOfferStartDate, updateOfferStartDateResult] = useStartDateUpdateMutation()

  const editOffer = async () => {
    try {
      const { data: createPriceIntentData } = await createPriceIntent({
        variables: {
          shopSessionId: params.shopSessionId,
          productName: params.productName,
        },
      })
      const priceIntentId = createPriceIntentData?.priceIntentCreate.id
      if (!priceIntentId) {
        datadogLogs.logger.error('Cross sell | price intent could not be created')
        return
      }

      const { errors: updatePriceIntentErrors } = await updatePriceIntent({
        variables: {
          priceIntentId,
          data: params.data,
          customer: { shopSessionId: params.shopSessionId },
        },
      })
      if (updatePriceIntentErrors) {
        datadogLogs.logger.error('Cross sell | price intent could not be updated', {
          priceIntentId,
        })
        return
      }

      const { data: confirmPriceIntentData } = await confirmPriceIntent({
        variables: {
          priceIntentId,
        },
      })
      const offer = confirmPriceIntentData?.priceIntentConfirm.priceIntent?.offers[0]
      if (!offer) {
        datadogLogs.logger.error('Cross sell | price intent could not be confirmed', {
          priceIntentId,
        })
        return
      }

      const { data: updateOfferStartDateData } = await updateOfferStartDate({
        variables: {
          productOfferIds: [offer.id],
          startDate: formatAPIDate(params.startDate),
        },
      })
      const updatedOffer = updateOfferStartDateData?.productOffersStartDateUpdate.productOffers[0]
      if (!updatedOffer) {
        datadogLogs.logger.error('Cross sell | offer start date could not be updated', {
          offerId: offer.id,
        })
        return
      }

      return updatedOffer
    } catch (error) {
      datadogLogs.logger.error('Cross sell | error while editing product offer', {
        error,
        shopSessionId: params.shopSessionId,
        productName: params.productName,
      })
    }
  }

  const isLoading =
    createPriceIntentResult.loading ||
    updatePriceIntentResult.loading ||
    confirmPriceIntentResult.loading ||
    updateOfferStartDateResult.loading

  return [editOffer, isLoading] as const
}
