import { useCheckoutStartMutation } from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

type Params = {
  shopSessionId: string
  onCompleted: (data: ShopSession) => void
}

export const useStartCheckout = ({ shopSessionId, onCompleted }: Params) => {
  const { locale } = useCurrentLocale()
  return useCheckoutStartMutation({
    variables: { shopSessionId, locale },
    onCompleted: (data) => onCompleted(data.shopSessionCheckoutStart),
  })
}
