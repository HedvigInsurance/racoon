import type { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import type {
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
  GlobalProductMetadata,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'

export type CheckoutPageProps = {
  shopSessionId: string
  shopSessionSigningId: string | null
  ssn: string
  shouldCollectEmail: boolean
  shouldCollectName: boolean
  checkoutSteps: Array<CheckoutStep>
  shopSession: ShopSession
  [GLOBAL_PRODUCT_METADATA_PROP_NAME]: GlobalProductMetadata
}
