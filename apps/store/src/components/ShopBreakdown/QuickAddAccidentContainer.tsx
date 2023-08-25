import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { atom, useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useHandleSubmitAddToCart } from '@/components/ProductPage/PurchaseForm/useHandleSubmitAddToCart'
import {
  OfferRecommendationFragment,
  ProductRecommendationFragment,
} from '@/services/apollo/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { QuickAdd } from './QuickAdd'

type Props = {
  shopSessionId: string
  offer: OfferRecommendationFragment
  product: ProductRecommendationFragment
}

export const QuickAddAccidentContainer = (props: Props) => {
  const [show, setShow] = useShowQuickAddOffer()
  const { t } = useTranslation('cart')

  const [getHandleSubmitAddToCart, loading] = useHandleSubmitAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Added quick offer to cart', {
        priceIntentId: props.offer.id,
        product: props.product.id,
      })
    },
  })

  const tracking = useTracking()
  const handleSubmitAddToCart = getHandleSubmitAddToCart(props.offer.id)
  const handleAdd: typeof handleSubmitAddToCart = (event) => {
    datadogRum.addAction('Quick add to cart', {
      priceIntentId: props.offer.id,
      product: props.product.id,
    })
    tracking.reportAddToCart(props.offer, 'recommendations')
    return handleSubmitAddToCart(event)
  }

  if (!show) return null

  const handleDismiss = () => {
    datadogRum.addAction('Hide offer', { priceIntentId: props.offer.id, product: props.product.id })
    setShow(false)
  }

  const householdSize = (parseInt(props.offer.priceIntentData.numberCoInsured) || 0) + 1
  const subtitle = t('QUICK_ADD_HOUSEHOLD_SIZE', { count: householdSize })

  const cost = {
    currencyCode: props.offer.cost.net.currencyCode,
    amount: props.offer.cost.gross.amount,
    reducedAmount: props.offer.cost.discount.amount > 0 ? props.offer.cost.net.amount : undefined,
  } as const

  return (
    <QuickAdd
      title={props.product.displayNameFull}
      subtitle={subtitle}
      pillow={props.product.pillowImage}
      cost={cost}
      onSubmitAdd={handleAdd}
      loading={loading}
      onDismiss={handleDismiss}
    />
  )
}

const SHOW_QUICK_ADD_OFFER_ATOM = atom(true)

const useShowQuickAddOffer = () => {
  return useAtom(SHOW_QUICK_ADD_OFFER_ATOM)
}
