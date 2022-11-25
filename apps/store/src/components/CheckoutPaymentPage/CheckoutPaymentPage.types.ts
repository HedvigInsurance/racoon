import { PaymentMethodsResponseObject } from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse/types'

type CostData = { crossOut?: number; net: number; gross: number }
type ProductData = { name: string; cost: number }
type CampaignData = { name: string; discount: number }

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
  checkoutSigningId: string | null
}
