import { CartCost, CartCampaign, CartEntry } from '@/components/CartInventory/CartInventory.types'

export type CartPageProps = {
  cartId: string
  cost: CartCost
  campaigns: Array<CartCampaign>
  entries: Array<CartEntry>
  prevURL: string
}
