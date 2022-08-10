type CostData = { crossOut?: number; total: number; subTotal: number }
type ProductData = { name: string; cost: number; startDate?: string }
type CampaignData = { name: string; discount: number }

export type CartReviewPageProps = {
  currency: string
  cost: CostData
  products: Array<ProductData>
  campaigns?: Array<CampaignData>
}
