import { addYears } from 'date-fns'
import { useTranslation } from 'next-i18next'
import { ChangeEventHandler } from 'react'
import { formatInputDateValue } from '@/utils/date'
import { InputDate } from './InputDate'

type Props = {
  name?: string
  label?: string
  date?: Date
  onChange?: (date: Date) => void
}

export const InputStartDate = ({ name, label, date, onChange }: Props) => {
  const { t } = useTranslation('purchase-form')
  const dateToday = new Date()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.valueAsDate) {
      onChange?.(event.target.valueAsDate)
    }
  }

  const inputValue = date ? formatInputDateValue(date) : undefined
  // Based on underwriter guidelines: https://github.com/HedvigInsurance/underwriter/blob/master/src/main/kotlin/com/hedvig/underwriter/model/Quote.kt#L83
  const min = formatInputDateValue(dateToday)
  const max = formatInputDateValue(addYears(dateToday, 2))

  return (
    <InputDate
      name={name}
      type="date"
      label={label ?? t('START_DATE_FIELD_LABEL')}
      required={true}
      value={inputValue}
      min={min}
      max={max}
      onChange={handleChange}
    />
  )
}
