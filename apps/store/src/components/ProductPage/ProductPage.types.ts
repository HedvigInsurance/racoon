import { CmsProduct } from '@/services/cms/cms.types'
import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { CurrencyCode } from '@/services/graphql/generated'
import { Product } from '@/services/mockProductService'

export type ProductPageProps = {
  cmsProduct: CmsProduct
  product: Product & {
    currencyCode: CurrencyCode
    price: number | null
    gradient: [string, string]
  }
  priceFormTemplate: FormTemplate
}
