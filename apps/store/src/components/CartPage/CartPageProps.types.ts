import { CartCost, CartCampaign, CartEntry } from '@/components/CartInventory/CartInventory.types'

export type CartPageProps = {
  cartId?: string
  campaignsEnabled?: boolean
  campaigns?: Array<CartCampaign>
  cost?: CartCost
  entries?: Array<CartEntry>
}
