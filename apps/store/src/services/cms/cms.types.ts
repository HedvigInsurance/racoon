import { MarketLabel } from '@/lib/l10n/types'
import { ProductNames } from '@/services/mockProductService'

export { MarketLabel } from '@/lib/l10n/types'

export type CmsProduct = {
  market: MarketLabel
  displayName: string
  slug: string
  pageTitle: string
  product: ProductNames
  productId: string
}
