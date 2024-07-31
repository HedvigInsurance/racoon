import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { type CarMileageField as CarMileageFieldType } from '@/services/PriceCalculator/Field.types'

type Props = {
  field: CarMileageFieldType
  autoFocus?: boolean
  backgroundColor?: ComponentProps<typeof InputSelect>['backgroundColor']
}

// NOTE: API values are in Scandinavian miles (1=10km)
const options = [
  { displayValue: '1 000', value: '1000' },
  { displayValue: '1 500', value: '1500' },
  { displayValue: '2 000', value: '2000' },
  { displayValue: '2 500', value: '2500' },
  { displayValue: '2 500+', value: '2501' },
]

export const CarMileageField = ({ field, autoFocus, backgroundColor }: Props) => {
  const { t } = useTranslation('purchase-form')

  // TODO: Use size=medium when text input styles are updated
  return (
    <InputSelect
      name={field.name}
      label={t('FIELD_MILEAGE_LABEL')}
      placeholder={t('FIELD_MILEAGE_PLACEHOLDER')}
      size="large"
      required={field.required}
      defaultValue={field.value ?? field.defaultValue}
      options={options.map((option) => ({
        name: t('YEARLY_MILEAGE_VALUE', { value: option.displayValue }),
        value: option.value,
      }))}
      autoFocus={autoFocus}
      backgroundColor={backgroundColor}
    />
  )
}
