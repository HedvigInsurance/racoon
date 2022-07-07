import { FormTemplate } from '@/services/formTemplate/FormTemplate.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'

type OnSubmitParams = { data: Record<string, string> }

export type TestPricePageProps = {
  template: FormTemplate
  intent: PriceIntent
  onSubmit: (params: OnSubmitParams) => void
  onReset: () => void
}
