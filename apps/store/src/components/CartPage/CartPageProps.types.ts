export type ProductData = { id: string; name: string; cost: number; currency: string }
type CostData = { crossOut?: number; total: number; subTotal: number }

export type CartPageProps = {
  products: Array<ProductData>
  cost: CostData
}
