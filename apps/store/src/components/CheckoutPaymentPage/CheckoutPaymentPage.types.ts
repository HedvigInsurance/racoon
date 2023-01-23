import { PaymentMethodsResponseObject } from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse/types'
import { Money } from '@/utils/formatter'

type CostData = { crossOut?: Money; net: Money; gross: Money }
type ProductData = { name: string; cost: Money }
type CampaignData = { name: string; discount: Money }

export type CheckoutPaymentPageProps = {
  currency: string
  cost: CostData
  products: Array<ProductData>
  campaigns?: Array<CampaignData>
}

export type CheckoutPaymentPageAdyenProps = CheckoutPaymentPageProps & {
  paymentMethodsResponse: PaymentMethodsResponseObject
  isPaymentConnected: boolean

  shopSessionId: string
  checkoutId: string
  shopSessionSigningId: string | null
}
