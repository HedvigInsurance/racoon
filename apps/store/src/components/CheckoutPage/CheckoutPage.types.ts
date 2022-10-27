type CostData = { crossOut?: number; total: number; subTotal: number }
type CampaignData = { name: string; discount: number }
type ProductData = {
  offerId: string
  name: string
  cost: number
  startDate?: string
  errorMessage?: string
}

export type CheckoutPageProps = {
  currency: string
  cost: CostData
  products: Array<ProductData>
  campaigns?: Array<CampaignData>
  loading: boolean
  prefilledData: { email?: string }
  userErrors: UserErrors
}

export type UserErrors = Record<string, string>
