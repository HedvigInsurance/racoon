import type { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import type { ShopSessionAuthenticationStatus } from '@/services/graphql/generated'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'

export type CheckoutPageProps = {
  shopSessionId: string
  customerAuthenticationStatus: ShopSessionAuthenticationStatus
  shopSessionSigningId: string | null
  ssn: string
  shouldCollectEmail: boolean
  shouldCollectName: boolean
  checkoutSteps: Array<CheckoutStep>
  shopSession: ShopSession
}
