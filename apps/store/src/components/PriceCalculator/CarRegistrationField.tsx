import { InputCarRegistrationNumber } from '@/components/InputCarRegistrationNumber/InputCarRegistrationNumber'
import { CarRegistrationNumberField as CarRegistrationNumberFieldType } from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type RegistrationFieldProps = {
  field: CarRegistrationNumberFieldType
  autoFocus?: boolean
}

export const CarRegistrationNumberField = ({ field, autoFocus }: RegistrationFieldProps) => {
  const translateLabel = useTranslateFieldLabel()

  return (
    <InputCarRegistrationNumber
      name={field.name}
      label={translateLabel(field.label)}
      required={field.required}
      autoFocus={autoFocus}
    />
  )
}
