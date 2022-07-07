import { CmsProduct } from '@/services/cms/cms.types'
import { Product } from '@/services/mockProductService'

export type ProductPageProps = {
  cmsProduct: CmsProduct
  product: Product
}
