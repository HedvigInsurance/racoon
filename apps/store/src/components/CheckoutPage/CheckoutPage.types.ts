import { CartCampaign, CartCost, CartEntry } from '@/components/CartInventory/CartInventory.types'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'

export type CheckoutPageProps = {
  shopSessionId: string
  customerAuthenticationStatus:
    | ShopSessionAuthenticationStatus.Authenticated
    | ShopSessionAuthenticationStatus.None
  shopSessionSigningId: string | null
  cart: {
    id: string
    entries: Array<CartEntry>
    cost: CartCost
    campaigns: Array<CartCampaign>
  }
  ssn: string
  collectEmail: boolean
  collectName: boolean
}
