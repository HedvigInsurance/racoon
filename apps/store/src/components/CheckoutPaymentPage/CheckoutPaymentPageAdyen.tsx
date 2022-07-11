import { AdyenCheckout } from '@/services/adyen/AdyenCheckout'
import { CheckoutPaymentPage } from './CheckoutPaymentPage'
import { CheckoutPaymentPageProps } from './CheckoutPaymentPage.types'

export const CheckoutPaymentPageAdyen = (props: CheckoutPaymentPageProps) => {
  return (
    <CheckoutPaymentPage {...props}>
      <AdyenCheckout />
    </CheckoutPaymentPage>
  )
}
