import { useCheckoutStartMutation } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

type Params = {
  shopSessionId: string
  onCompleted: (data: ShopSession) => void
}

export const useStartCheckout = ({ shopSessionId, onCompleted }: Params) => {
  return useCheckoutStartMutation({
    variables: { shopSessionId },
    onCompleted: (data) => onCompleted(data.shopSessionCheckoutStart),
  })
}
