import { useCheckoutStartMutation } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useTracking } from '@/services/Tracking/useTracking'

type Params = {
  shopSessionId: string
  onCompleted: (data: ShopSession) => void
}

export const useStartCheckout = ({ shopSessionId, onCompleted }: Params) => {
  const tracking = useTracking()
  return useCheckoutStartMutation({
    variables: { shopSessionId },
    onCompleted: (data) => {
      const { cart } = data.shopSessionCheckoutStart
      tracking.reportBeginCheckout(cart)
      onCompleted(data.shopSessionCheckoutStart)
    },
  })
}
