import { CmsProduct } from '@/services/cms'
import { Product } from '@/services/mockProductService'

export type ProductPageProps = {
  cmsProduct: CmsProduct
  product: Product
}
