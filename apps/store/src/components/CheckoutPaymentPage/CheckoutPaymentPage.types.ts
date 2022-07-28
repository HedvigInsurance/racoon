type CostData = { crossOut?: number; total: number; subTotal: number }
export type ProductData = { name: string; cost: number; currency: string }
type CampaignData = { name: string; discount: number }

export type CheckoutPaymentPageProps = {
  currency: string
  cost: CostData
  products: Array<ProductData>
  campaigns?: Array<CampaignData>
}
