import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { type OfferRecommendationFragment } from '@/services/apollo/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'

type Props = {
  shopSessionId: string
  offer: OfferRecommendationFragment
  productName: string
}

export const AddToCartButton = (props: Props) => {
  const { t } = useTranslation('cart')

  const [addToCart, loading] = useAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Quick Add | Added offer to cart', {
        productOfferId: props.offer.id,
        product: props.productName,
      })
    },
  })

  const tracking = useTracking()
  const handleAdd = () => {
    datadogRum.addAction('Quick Add To Cart', {
      type: 'complete',
      productOfferId: props.offer.id,
      product: props.productName,
    })
    tracking.reportAddToCart(props.offer, 'recommendations')
    addToCart(props.offer.id)
  }

  return (
    <Button size="medium" loading={loading} onClick={handleAdd}>
      {t('QUICK_ADD_BUTTON')}
    </Button>
  )
}
