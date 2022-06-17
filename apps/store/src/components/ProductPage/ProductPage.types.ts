import { PriceForm } from '@/components/PriceCalculator/PriceCalculator.types'
import { CmsProduct } from '@/services/mockCmsService'

export type ProductPageProps = {
  cmsProduct: CmsProduct
  priceForm: PriceForm
}
