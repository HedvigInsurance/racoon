import { FormGroup } from './FormGroup'
import { PriceForm } from './PriceCalculator.types'

type OnSubmitParams = {
  id: string
  data: FormData
}

export type PriceCalculatorProps = {
  form: PriceForm
  onSubmit: (params: OnSubmitParams) => void
}

export const PriceCalculator = ({ onSubmit, form }: PriceCalculatorProps) => {
  return (
    <>
      {form.groups.map(({ id, inputs }) => (
        <FormGroup key={id} onSubmit={(data) => onSubmit({ id, data })} inputs={inputs} />
      ))}
    </>
  )
}
