import { FormGroup } from './FormGroup'
import { PriceForm } from './PriceCalculator.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type OnSubmitParams = {
  id: string
  data: FormData
}

export type PriceCalculatorProps = {
  form: PriceForm
  onSubmit: (params: OnSubmitParams) => void
}

const FORM_DATA = {}

export const PriceCalculator = ({ onSubmit, form }: PriceCalculatorProps) => {
  const translateTextLabel = useTranslateTextLabel({ data: FORM_DATA })
  const activeGroup = form.groups.find((group) => group.state !== 'VALID')

  return (
    <div>
      {form.groups.map(({ id, title, inputs, state, summary }) => (
        <div key={id}>
          <h2>{translateTextLabel(title)}</h2>
          {activeGroup?.id === id ? (
            <FormGroup onSubmit={(data) => onSubmit({ id, data })} inputs={inputs} />
          ) : state === 'VALID' ? (
            <div>
              {summary.labels.map((label) => (
                <p key={label.key}>{label.key}</p>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      <div>
        <h2>Your price</h2>
        <p>
          <strong>Starting at 299 SEK/mth</strong>
        </p>
      </div>
    </div>
  )
}
