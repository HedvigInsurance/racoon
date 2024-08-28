import { LabeledText } from '@hedvig-ui/redesign'

export const InsuranceItem = ({
  label,
  value,
  format,
}: {
  label: string
  value: string | null | undefined
  format?: (value: string) => string
}) => {
  if (!value) {
    return null
  }
  return (
    <LabeledText label={label}>{format ? format(value) : value}</LabeledText>
  )
}
