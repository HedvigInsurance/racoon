import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'

type Product = {
  id: string
  name: string
  currencyCode: string
  price: number | null
  gradient: [string, string]
}

export type TestPricePageProps = {
  template: FormTemplate
  product: Product
}
