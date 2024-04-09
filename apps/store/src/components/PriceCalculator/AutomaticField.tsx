import { InputDate } from '@/components/InputDate/InputDate'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { TextField } from '@/components/TextField/TextField'
import type { InputField as InputFieldType } from '@/services/PriceCalculator/Field.types'
import type { JSONData } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceIntent } from '@/services/priceIntent/priceIntent.types'
import { convertToDate, formatAPIDate } from '@/utils/date'
import { Features } from '@/utils/Features'
import { InputDay } from '../InputDay/InputDay'
import { CarMileageField } from './CarMileageField'
import { CarRegistrationNumberField } from './CarRegistrationField'
import { CurrentInsuranceField } from './CurrentInsuranceField/CurrentInsuranceField'
import { ExtraBuildingsField } from './ExtraBuildingsField'
import * as InputRadio from './InputRadio'
import { PetCatBreedsField } from './PetCatBreedsField'
import { PetDogBreedsField } from './PetDogBreedsField'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

const USE_DAY_PICKER = Features.enabled('DAY_PICKER')

type Props = {
  field: InputFieldType
  onSubmit: (data: JSONData) => Promise<unknown>
  loading: boolean
  autoFocus?: boolean
  priceIntent: PriceIntent
}

export const AutomaticField = ({ field, priceIntent, onSubmit, loading, autoFocus }: Props) => {
  const translateLabel = useTranslateFieldLabel()

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
      return USE_DAY_PICKER ? (
        <InputDay
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultSelected={convertToDate(field.value ?? field.defaultValue) ?? undefined}
          fromDate={field.min === 'TODAY' ? new Date() : convertToDate(field.min) ?? undefined}
          toDate={field.max === 'TODAY' ? new Date() : convertToDate(field.max) ?? undefined}
          autoFocus={autoFocus}
        />
      ) : (
        <InputDate
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          min={field.min === 'TODAY' ? formatAPIDate(new Date()) : field.min}
          max={field.max === 'TODAY' ? formatAPIDate(new Date()) : field.max}
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
          label={translateLabel(field.label)}
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
      return <CarRegistrationNumberField field={field} autoFocus={autoFocus} />
    case 'car-mileage':
      return <CarMileageField field={field} />

    case 'current-insurance':
      return (
        <CurrentInsuranceField
          label={translateLabel(field.label)}
          productName={priceIntent.product.name}
          priceIntentId={priceIntent.id}
          externalInsurer={priceIntent.externalInsurer?.id}
        />
      )

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
      return <PetCatBreedsField field={field} loading={loading} />

    case 'pet-dog-breeds':
      return <PetDogBreedsField field={field} loading={loading} />

    default: {
      const badField: never = field
      console.warn(`Did not find field type=${(badField as any).type}.  Field not displayed`)
      return null
    }
  }
}
