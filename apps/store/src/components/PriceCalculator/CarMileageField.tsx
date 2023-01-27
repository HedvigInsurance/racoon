import { useTranslation } from 'next-i18next'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { CarMileageField as CarMileageFieldType } from '@/services/PriceCalculator/Field.types'

type Props = {
  field: CarMileageFieldType
  autoFocus?: boolean
}

// NOTE: API values are in Scandinavian miles (1=10km)
const options = [
  { displayValue: '10 000', value: '1000' },
  { displayValue: '15 000', value: '1500' },
  { displayValue: '20 000', value: '2000' },
  { displayValue: '25 000', value: '2500' },
  { displayValue: '25 000+', value: '2501' },
]

export const CarMileageField = ({ field, autoFocus }: Props) => {
  const { t } = useTranslation('purchase-form')
  return (
    <InputSelect
      name={field.name}
      placeholder={t(field.label.key, { defaultValue: t('FIELD_MILEAGE_LABEL') })}
      required={field.required}
      defaultValue={field.value ?? field.defaultValue}
      options={options.map((option) => ({
        name: t('YEARLY_MILEAGE_VALUE', { value: option.displayValue }),
        value: option.value,
      }))}
      autoFocus={autoFocus}
    />
  )
}
