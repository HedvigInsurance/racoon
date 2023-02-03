import { CartCost, CartCampaign, CartEntry } from '@/components/CartInventory/CartInventory.types'
import { ProductRecommendationFragment } from '@/services/apollo/generated'

export type CartPageProps = {
  cartId: string
  campaignsEnabled: boolean
  campaigns: Array<CartCampaign>
  cost: CartCost
  entries: Array<CartEntry>
  recommendations: Array<ProductRecommendationFragment>
}
