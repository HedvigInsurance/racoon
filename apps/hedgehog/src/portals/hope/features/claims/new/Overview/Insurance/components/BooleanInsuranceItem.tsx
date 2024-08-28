import { LabeledText } from '@hedvig-ui/redesign'

export const BooleanInsuranceItem = ({
  label,
  value,
}: {
  label: string
  value: boolean | null | undefined
}) => {
  if (typeof value !== 'boolean') {
    return null
  }
  return <LabeledText label={label}>{value ? 'Yes' : 'No'}</LabeledText>
}
