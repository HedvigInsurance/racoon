import { InputDate } from '@/components/InputDate/InputDate'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { TextField } from '@/components/TextField/TextField'
import { InputField as InputFieldType } from '@/services/PriceCalculator/Field.types'
import { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { CarMileageField } from './CarMileageField'
import { CarRegistrationNumberField } from './CarRegistrationField'
import { CurrentInsuranceField } from './CurrentInsuranceField/CurrentInsuranceField'
import { ExtraBuildingsField } from './ExtraBuildingsField'
import * as InputRadio from './InputRadio'
import { PetCatBreedsField } from './PetCatBreedsField'
import { PetDogBreedsField } from './PetDogBreedsField'
import { StepperInput } from './StepperInput/StepperInput'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  field: InputFieldType
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
  autoFocus?: boolean
  priceIntent: PriceIntent
}

export const AutomaticField = ({ field, priceIntent, onSubmit, loading, autoFocus }: Props) => {
  const translateLabel = useTranslateFieldLabel()
  const { productData } = useProductPageContext()

  switch (field.type) {
    case 'text':
      return (
        <TextField
          type={field.inputType ?? 'text'}
          name={field.name}
          label={translateLabel(field.label)}
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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          name={field.name}
          label={translateLabel(field.label)}
          min={field.min}
          max={field.max}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          autoFocus={autoFocus}
        />
      )

    case 'date':
      return (
        <InputDate
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          min={field.min}
          max={field.max}
          autoFocus={autoFocus}
        />
      )

    case 'radio':
      return field.stacking === 'horizontal' ? (
        <InputRadio.HorizontalRoot
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
        >
          {field.options.map((option, index) => (
            <InputRadio.HorizontalItem
              key={option.value}
              id={`${field.name}-${option.value}`}
              label={translateLabel(option.label)}
              value={option.value}
              autoFocus={autoFocus && index === 0}
            />
          ))}
        </InputRadio.HorizontalRoot>
      ) : (
        <InputRadio.Root
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
        >
          {field.options.map((option, index) => (
            <InputRadio.Item
              key={option.value}
              id={`${field.name}-${option.value}`}
              label={translateLabel(option.label)}
              value={option.value}
              autoFocus={autoFocus && index === 0}
            />
          ))}
        </InputRadio.Root>
      )

    case 'select':
      return (
        <InputSelect
          name={field.name}
          label={field.label ? translateLabel(field.label) : undefined}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
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

    case 'car-registration-number':
      return <CarRegistrationNumberField field={field} />
    case 'car-mileage':
      return <CarMileageField field={field} />

    case 'current-insurance':
      return productData.insurelyClientId ? (
        <CurrentInsuranceField
          label={translateLabel(field.label)}
          productName={productData.name}
          priceIntentId={priceIntent.id}
          insurelyClientId={productData.insurelyClientId}
          externalInsurer={priceIntent.externalInsurer?.id}
        />
      ) : // TODO: Add a fallback for when we don't have an insurelyClientId
      null

    case 'stepper':
      return (
        <StepperInput
          name={field.name}
          max={field.max}
          min={field.min}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          autoFocus={autoFocus}
          optionLabel={(count) => translateLabel(field.valueLabel, { count })}
        />
      )

    case 'pet-cat-breeds':
      return <PetCatBreedsField field={field} onSubmit={onSubmit} loading={loading} />

    case 'pet-dog-breeds':
      return <PetDogBreedsField field={field} onSubmit={onSubmit} loading={loading} />

    default: {
      const badField: never = field
      console.warn(`Did not find field type=${(badField as any).type}.  Field not displayed`)
      return null
    }
  }
}
