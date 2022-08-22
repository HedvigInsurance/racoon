type CostData = { total: number }
type ProductData = { name: string; startDate: string }

export type ConfirmationPageProps = {
  currency: string
  cost: CostData
  firstName: string
  products: Array<ProductData>
  platform: 'apple' | 'google' | null
}
