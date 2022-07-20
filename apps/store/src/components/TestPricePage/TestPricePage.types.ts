import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'

type Product = {
  id: string
  name: string
  currentCode: string
  price?: number
}

export type TestPricePageProps = {
  template: FormTemplate
  product: Product
}
