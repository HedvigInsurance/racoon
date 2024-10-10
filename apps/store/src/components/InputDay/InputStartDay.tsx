import { addYears } from 'date-fns/addYears'
import { useTranslation } from 'next-i18next'
import { InputDay } from './InputDay'

type Props = {
  name?: string
  label?: string
  date?: Date
  onChange?: (date: Date) => void
  loading?: boolean
  disabled?: boolean
}

export const InputStartDay = (props: Props) => {
  const { t } = useTranslation('purchase-form')

  const handleSelect = (date: Date) => {
    props.onChange?.(date)
  }

  // Based on underwriter guidelines: https://github.com/HedvigInsurance/underwriter/blob/master/src/main/kotlin/com/hedvig/underwriter/model/Quote.kt#L83
  const dateToday = new Date()
  const fromDate = dateToday
  const toDate = addYears(dateToday, 2)

  return (
    <InputDay
      name={props.name}
      label={props.label ?? t('START_DATE_FIELD_LABEL')}
      required={true}
      selected={props.date}
      fromDate={fromDate}
      toDate={toDate}
      onSelect={handleSelect}
      loading={props.loading}
      disabled={props.disabled}
    />
  )
}
