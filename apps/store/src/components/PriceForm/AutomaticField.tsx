import { InputField } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { HouseholdSizeField } from '@/components/PriceForm/HouseholdSize'
import { InputField as InputFieldType } from '@/services/PriceForm/Field.types'
import { JSONData } from '@/services/PriceForm/PriceForm.types'
import { CarRegistrationNumberField } from './CarRegistrationField'
import { ExtraBuildingsField } from './ExtraBuildingsField'
import { InputRadio } from './InputRadio'
import { SsnSeField } from './SsnSeField'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type Props = {
  field: InputFieldType
  onSubmit: (data: JSONData) => Promise<void>
  loading: boolean
  autoFocus?: boolean
}

export const AutomaticField = ({ field, onSubmit, loading, autoFocus }: Props) => {
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
          inputMode={field.inputMode ?? 'text'}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          autoFocus={autoFocus}
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
          inputMode="numeric"
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          autoFocus={autoFocus}
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
          autoFocus={autoFocus}
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
          autoFocus={autoFocus}
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
          autoFocus={autoFocus}
        />
      )

    case 'extra-buildings':
      return (
        <ExtraBuildingsField
          field={field}
          buildingOptions={field.buildingOptions.map((buildingOption) => ({
            ...buildingOption,
            name: buildingOption.label,
          }))}
          onSubmit={onSubmit}
          loading={loading}
        />
      )

    case 'householdSize':
      return <HouseholdSizeField field={field} />

    case 'ssn-se':
      return <SsnSeField field={field} />
    case 'car-registration-number':
      return <CarRegistrationNumberField field={field} />
  }
}