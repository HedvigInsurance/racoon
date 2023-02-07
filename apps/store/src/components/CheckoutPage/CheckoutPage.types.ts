import { CartCampaign, CartCost, CartEntry } from '@/components/CartInventory/CartInventory.types'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { ShopSessionAuthenticationStatus } from '@/services/apollo/generated'

export type CheckoutPageProps = {
  shopSessionId: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  shopSessionSigningId: string | null
  cart: {
    id: string
    entries: Array<CartEntry>
    cost: CartCost
    campaigns: Array<CartCampaign>
  }
  ssn: string
  shouldCollectEmail: boolean
  shouldCollectName: boolean
  checkoutSteps: Array<CheckoutStep>
}
