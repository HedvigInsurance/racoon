import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { Button, type ButtonProps } from 'ui'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'

type Props = {
  shopSessionId: string
  offer: OfferRecommendationFragment
  productName: string
} & Omit<ButtonProps<'button'>, 'onClick' | 'loading'>

export const AddToCartButton = ({ shopSessionId, offer, productName, ...buttonProps }: Props) => {
  const [addToCart, loading] = useAddToCart({
    shopSessionId: shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Quick Add | Added offer to cart', {
        productOfferId: offer.id,
        product: productName,
      })
      window.scrollTo({ top: 0 })
    },
  })

  const tracking = useTracking()
  const handleAdd = () => {
    datadogRum.addAction('Quick Add To Cart', {
      type: 'complete',
      productOfferId: offer.id,
      product: productName,
    })
    tracking.reportAddToCart(offer, 'recommendations')
    addToCart(offer.id)
  }

  return <Button size="medium" {...buttonProps} onClick={handleAdd} loading={loading} />
}
