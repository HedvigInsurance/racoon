import * as PriceCalculatorService from '@/services/mockPriceCalculatorService'
import { FormGroup } from './FormGroup'
import { PriceForm } from './PriceCalculator.types'

type OnSubmitParams = { data: Record<string, string> }

export type PriceCalculatorProps = {
  form: PriceForm
  onSubmit: (params: OnSubmitParams) => void
}

export const PriceCalculator = ({ form, onSubmit }: PriceCalculatorProps) => {
  const handleSubmit = async (data: FormData) => {
    const userData: Record<string, string> = {}
    data.forEach((value, key) => {
      if (typeof value !== 'string') return
      userData[key] = value
    })

    onSubmit({ data: userData })
  }

  return (
    <>
      {form.groups.map(({ id, inputs }) => (
        <FormGroup key={id} onSubmit={handleSubmit} inputs={inputs} />
      ))}
    </>
  )
}
