import { forwardRef } from 'react'
import { FormGroup } from './FormGroup'
import { PriceFormTemplate } from './PriceCalculator.types'

type OnSubmitParams = { data: Record<string, string> }

export type PriceCalculatorProps = {
  form: PriceFormTemplate
  onSubmit: (params: OnSubmitParams) => void
}

export const PriceCalculator = forwardRef<HTMLFormElement, PriceCalculatorProps>(
  ({ form, onSubmit }, ref) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)

      const userData: Record<string, string> = {}
      data.forEach((value, key) => {
        if (typeof value !== 'string') return
        userData[key] = value
      })

      onSubmit({ data: userData })
    }

    return (
      <form ref={ref} onSubmit={handleSubmit}>
        {form.groups.map(({ id, inputs }) => (
          <FormGroup key={id} inputs={inputs} />
        ))}
      </form>
    )
  },
)

PriceCalculator.displayName = 'PriceCalculator'
