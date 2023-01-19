import { CartCost, CartCampaign, CartEntry } from '@/components/CartInventory/CartInventory.types'
import { ProductRecommendationFragment } from '@/services/apollo/generated'

export type CartPageProps = {
  // FIXME: Remove
  shopSessionId: string
  cartId: string
  cost: CartCost
  campaigns: Array<CartCampaign>
  entries: Array<CartEntry>
  recommendations: Array<ProductRecommendationFragment>
  prevURL: string
}
