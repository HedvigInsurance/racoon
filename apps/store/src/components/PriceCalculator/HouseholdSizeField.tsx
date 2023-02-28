import { useTranslation } from 'next-i18next'
import { HouseholdSizeField as HouseholdSizeFieldType } from '@/services/PriceCalculator/Field.types'
import { StepperInput } from './StepperInput/StepperInput'

type FieldProps = {
  field: HouseholdSizeFieldType
  autoFocus?: boolean
}

export const HouseholdSizeField = ({ field, autoFocus = false }: FieldProps) => {
  const { t } = useTranslation('purchase-form')

  return (
    <StepperInput
      name={field.name}
      required={field.required}
      value={field.value}
      defaultValue={field.defaultValue}
      min={0}
      max={field.max}
      autoFocus={autoFocus}
      optionLabel={(count) => t('HOUSEHOLD_SIZE_VALUE', { count })}
    />
  )
}
