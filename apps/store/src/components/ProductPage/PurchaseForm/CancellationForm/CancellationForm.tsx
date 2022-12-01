import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { Space } from 'ui'
import { Text } from '@/components/Text/Text'
import { formatInputDateValue } from '@/utils/date'
import { FormElement } from '../PurchaseForm.constants'
import { CheckboxInput } from './CheckboxInput'
import { DateInput } from './DateInput'

export type CancellationOption = { type: 'NONE' } | { type: 'IEX'; companyName: string }

type Props = {
  option: CancellationOption
  startDate: Date
  onStartDateChange?: (date: Date) => void
  onAutoSwitchChange?: (checked: boolean) => void
}

export const CancellationForm = ({ option, ...props }: Props) => {
  switch (option.type) {
    case 'IEX':
      return <IEXCancellation {...props} companyName={option.companyName} />
    case 'NONE':
      return <NoCancellation {...props} />
  }
}

type NoCancellationProps = Pick<Props, 'onStartDateChange'> & {
  startDate: Date
}

const NoCancellation = ({ onStartDateChange, startDate }: NoCancellationProps) => {
  return <StartDateInput startDate={startDate} onChange={onStartDateChange} />
}

type IEXCancellationProps = Pick<Props, 'onStartDateChange' | 'onAutoSwitchChange'> & {
  companyName: string
  startDate: Date
}

const IEXCancellation = (props: IEXCancellationProps) => {
  const { onStartDateChange, onAutoSwitchChange, companyName } = props
  const { t } = useTranslation('purchase-form')
  const [autoSwithEnabled, setAutoSwitchEnabled] = useState(true)
  const handleCheckedChange = (newValue: boolean) => {
    setAutoSwitchEnabled(newValue)
    onAutoSwitchChange?.(newValue)
  }

  return (
    <Space y={0.25}>
      <CheckboxInput
        name={FormElement.AutoSwitch}
        label={t('AUTO_SWITCH_FIELD_LABEL')}
        checked={autoSwithEnabled}
        onCheckedChange={handleCheckedChange}
      >
        {autoSwithEnabled && (
          <Text as="p" size="s" color="gray700">
            {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: companyName })}
          </Text>
        )}
      </CheckboxInput>

      {!autoSwithEnabled && (
        <StartDateInput startDate={props.startDate} onChange={onStartDateChange} />
      )}
    </Space>
  )
}

type StartDateInputProps = { startDate: Date; onChange?: (date: Date) => void }

const StartDateInput = ({ startDate, onChange }: StartDateInputProps) => {
  const { t } = useTranslation('purchase-form')
  const dateToday = new Date()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.valueAsDate) {
      onChange?.(event.target.valueAsDate)
    }
  }

  const inputValue = formatInputDateValue(startDate)
  const inputValueToday = formatInputDateValue(dateToday)
  const isToday = inputValue === inputValueToday

  return (
    <DateInput
      type="date"
      name={FormElement.StartDate}
      label={t('START_DATE_FIELD_LABEL')}
      required
      value={inputValue}
      min={inputValueToday}
      onChange={handleChange}
    >
      {isToday && (
        <Text as="p" size="s" color="gray700">
          {t('START_DATE_FIELD_TODAY')}
        </Text>
      )}
    </DateInput>
  )
}
