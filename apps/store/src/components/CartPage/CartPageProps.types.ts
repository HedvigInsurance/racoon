import { CartCost, CartCampaign } from '@/components/CartInventory/CartInventory.types'
import { Money } from '@/utils/formatter'

export type CartEntry = {
  offerId: string
  title: string
  cost: Money
  startDate?: Date
}

export type CartPageProps = {
  shopSessionId: string
  cartId: string
  cost: CartCost
  campaigns: Array<CartCampaign>
  entries: Array<CartEntry>
  prevURL: string
}
