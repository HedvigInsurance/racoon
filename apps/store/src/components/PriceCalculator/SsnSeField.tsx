import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SsnSeField as SsnSeFieldType } from '@/services/PriceCalculator/Field.types'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type SsnSeFieldProps = {
  field: SsnSeFieldType
}

export const SsnSeField = ({ field }: SsnSeFieldProps) => {
  const translateLabel = useTranslateFieldLabel()

  return <PersonalNumberField {...field} label={translateLabel(field.label)} />
}
