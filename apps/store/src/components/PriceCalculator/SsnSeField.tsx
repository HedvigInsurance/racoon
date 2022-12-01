import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SsnSeField as SsnSeFieldType } from '@/services/PriceCalculator/Field.types'
import { useTranslateTextLabel } from './useTranslateTextLabel'

type SsnSeFieldProps = {
  field: SsnSeFieldType
}

export const SsnSeField = ({ field }: SsnSeFieldProps) => {
  const translateLabel = useTranslateTextLabel({ data: {} })

  return (
    <PersonalNumberField
      {...field}
      placeholder={field.label ? translateLabel(field.label) : undefined}
    />
  )
}
