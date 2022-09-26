import { InputField } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { InputField as InputFieldType } from '@/services/PriceForm/Field.types'
import { JSONData } from '@/services/PriceForm/PriceForm.types'
import { ExtraBuildingsField } from './ExtraBuildingsField'
import { InputRadio } from './InputRadio'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = {
  field: InputFieldType
  onSubmit: (data: JSONData) => void
  loading: boolean
}

export const AutomaticField = ({ field, onSubmit, loading }: Props) => {
  const translateLabel = useTranslateTextLabel({ data: {} })

  switch (field.type) {
    case 'text':
      return (
        <InputField
          type="text"
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          pattern={field.pattern}
          minLength={field.minLength}
          maxLength={field.maxLength}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
        />
      )

    case 'number':
      return (
        <InputField
          type="number"
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          min={field.min}
          max={field.max}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
        />
      )

    case 'date':
      return (
        <InputField
          type="date"
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          min={field.min}
          max={field.max}
        />
      )

    case 'radio':
      return (
        <InputRadio
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          required={field.required}
          defaultValue={field.defaultValue}
          options={field.options.map((option) => ({
            ...option,
            label: translateLabel(option.label),
          }))}
        />
      )

    case 'select':
      return (
        <InputSelect
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          required={field.required}
          defaultValue={field.defaultValue}
          options={field.options.map((option) => ({
            ...option,
            name: translateLabel(option.label),
          }))}
        />
      )

    case 'extra-buildings':
      return <ExtraBuildingsField field={field} onSubmit={onSubmit} loading={loading} />
  }
}
