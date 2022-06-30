import { PriceForm } from '@/components/PriceCalculator/PriceCalculator.types'
import { MarketLabel } from '@/lib/l10n/types'
import { ProductNames } from '@/services/mockProductService'

export { MarketLabel } from '@/lib/l10n/types'

export type CmsProduct = {
  market: MarketLabel
  displayName: string
  slug: string
  pageTitle: string
  form: PriceForm
  product: ProductNames
}
