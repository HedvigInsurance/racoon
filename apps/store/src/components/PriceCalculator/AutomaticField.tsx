import { InputField } from 'ui'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { CarMileageField } from '@/components/PriceCalculator/CarMileageField'
import { HouseholdSizeField } from '@/components/PriceCalculator/HouseholdSizeField/HouseholdSizeField'
import { TextField } from '@/components/TextField/TextField'
import { InputField as InputFieldType } from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { CarRegistrationNumberField } from './CarRegistrationField'
import { CurrentInsuranceField } from './CurrentInsuranceField/CurrentInsuranceField'
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
  const { story, priceIntent } = useProductPageContext()

  switch (field.type) {
    case 'text':
      return (
        <TextField
          type="text"
          name={field.name}
          placeholder={translateLabel(field.label)}
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
        <TextField
          type="number"
          name={field.name}
          placeholder={translateLabel(field.label)}
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
    case 'car-mileage':
      return <CarMileageField field={field} />

    case 'current-insurance':
      return (
        <CurrentInsuranceField
          label={translateLabel(field.label)}
          productName={story.content.productId}
          priceIntentId={priceIntent.id}
          externalInsurer={priceIntent.cancellation.externalInsurer?.id}
        />
      )
    default: {
      const badField: never = field
      console.warn(`Did not find field type=${(badField as any).type}.  Field not displayed`)
      return null
    }
  }
}
