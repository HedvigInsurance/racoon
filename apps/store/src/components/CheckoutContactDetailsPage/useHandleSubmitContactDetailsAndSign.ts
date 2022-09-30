import { useHandleSignCheckout } from '@/services/Checkout/useHandleSignCheckout'
import { useHandleSubmitContactDetails } from './useHandleSubmitContactDetails'

type Params = {
  checkoutId: string
  checkoutSigningId: string | null
  onSuccess: (accessToken: string) => void
}

export const useHandleSubmitContactDetailsAndSign = (params: Params) => {
  const [startSign, loadingSign] = useHandleSignCheckout(params)

  const [handleSubmit, { loading: loadingContactDetails }] = useHandleSubmitContactDetails({
    checkoutId: params.checkoutId,
    onSuccess: startSign,
  })

  return [handleSubmit, loadingContactDetails || loadingSign] as const
}
