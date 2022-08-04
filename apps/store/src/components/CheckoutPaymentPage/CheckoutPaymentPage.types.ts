type CostData = { crossOut?: number; total: number; subTotal: number }
type ProductData = { name: string; cost: number }
type CampaignData = { name: string; discount: number }

export type CheckoutPaymentPageProps = {
  currency: string
  cost: CostData
  products: Array<ProductData>
  campaigns?: Array<CampaignData>
}
