import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'

export type CheckoutPageProps = {
  shopSessionId: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  shopSessionSigningId: string | null
  ssn: string
  shouldCollectEmail: boolean
  suggestedEmail?: string
  shouldCollectName: boolean
  checkoutSteps: Array<CheckoutStep>
  shopSession: ShopSession
}
