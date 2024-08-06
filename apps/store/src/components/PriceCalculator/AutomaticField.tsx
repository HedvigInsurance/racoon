import { InputRadio, HorizontalInputRadio } from '@/components/InputRadio/InputRadio'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { UseRegistrationAddressField } from '@/components/PriceCalculator/UseRegistrationAddressField'
import { StepperInput } from '@/components/StepperInput/StepperInput'
import { TextField } from '@/components/TextField/TextField'
import type { InputField as InputFieldType } from '@/services/PriceCalculator/Field.types'
import { convertToDate } from '@/utils/date'
import { InputDay } from '../InputDay/InputDay'
import { CarMileageField } from './CarMileageField'
import { CarRegistrationNumberField } from './CarRegistrationField'
import { CurrentInsuranceField } from './CurrentInsuranceField/CurrentInsuranceField'
import { ExtraBuildingsField } from './ExtraBuildingsField'
import { PetCatBreedsField } from './PetCatBreedsField'
import { PetDogBreedsField } from './PetDogBreedsField'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  field: InputFieldType
  autoFocus?: boolean
}

export const AutomaticField = ({ field, autoFocus }: Props) => {
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
          suffix={field.suffix}
        />
      )

    case 'date':
      return (
        <InputDay
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultSelected={convertToDate(field.value ?? field.defaultValue) ?? undefined}
          fromDate={field.min === 'TODAY' ? new Date() : (convertToDate(field.min) ?? undefined)}
          toDate={field.max === 'TODAY' ? new Date() : (convertToDate(field.max) ?? undefined)}
          autoFocus={autoFocus}
        />
      )

    case 'radio': {
      const RadioComponent = field.stacking === 'horizontal' ? HorizontalInputRadio : InputRadio

      return (
        <RadioComponent
          name={field.name}
          label={translateLabel(field.label)}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          options={field.options.map((option, index) => ({
            label: translateLabel(option.label),
            value: option.value,
            autoFocus: autoFocus && index === 0,
          }))}
        />
      )
    }

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

    case 'use-registration-address':
      return <UseRegistrationAddressField field={field} />

    case 'extra-buildings':
      return (
        <ExtraBuildingsField
          field={field}
          buildingOptions={field.buildingOptions.map((buildingOption) => ({
            ...buildingOption,
            name: buildingOption.label,
          }))}
        />
      )

    case 'car-registration-number':
      return <CarRegistrationNumberField field={field} autoFocus={autoFocus} />
    case 'car-mileage':
      return <CarMileageField field={field} />

    case 'current-insurance':
      return <CurrentInsuranceField label={translateLabel(field.label)} />

    case 'stepper':
      return (
        <StepperInput
          name={field.name}
          max={field.max}
          min={field.min}
          required={field.required}
          defaultValue={field.value ?? field.defaultValue}
          autoFocus={autoFocus}
          label={translateLabel(field.label)}
          optionLabel={(count) => translateLabel(field.valueLabel, { count })}
        />
      )

    case 'pet-cat-breeds':
      return <PetCatBreedsField field={field} />

    case 'pet-dog-breeds':
      return <PetDogBreedsField field={field} />

    default: {
      const badField: never = field
      console.warn(`Did not find field type=${(badField as any).type}.  Field not displayed`)
      return null
    }
  }
}
