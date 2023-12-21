import { datadogLogs } from '@datadog/browser-logs'
import { datadogRum } from '@datadog/browser-rum'
import { type ReactNode } from 'react'
import { Button } from 'ui'
import { type OfferRecommendationFragment } from '@/services/graphql/generated'
import { useTracking } from '@/services/Tracking/useTracking'
import { useAddToCart } from '@/utils/useAddToCart'

type Props = {
  shopSessionId: string
  offer: OfferRecommendationFragment
  productName: string
  children: ReactNode
}

export const AddToCartButton = (props: Props) => {
  const [addToCart, loading] = useAddToCart({
    shopSessionId: props.shopSessionId,
    onSuccess() {
      datadogLogs.logger.info('Quick Add | Added offer to cart', {
        productOfferId: props.offer.id,
        product: props.productName,
      })
      window.scrollTo({ top: 0 })
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
    <Button size="medium" fullWidth={true} loading={loading} onClick={handleAdd}>
      {props.children}
    </Button>
  )
}
