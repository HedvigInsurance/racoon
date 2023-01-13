import { CartCampaign, CartCost, CartEntry } from '@/components/CartInventory/CartInventory.types'

export type CheckoutPageProps = {
  shopSessionId: string
  checkoutId: string
  checkoutSigningId: string | null
  cart: {
    id: string
    entries: Array<CartEntry>
    cost: CartCost
    campaigns: Array<CartCampaign>
  }
  ssn: string
  prefilledData: {
    email?: string
    firstName?: string
    lastName?: string
  }
  collectName: boolean
}
