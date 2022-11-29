import { useTranslation } from 'next-i18next'
import { ChangeEventHandler, useState } from 'react'
import { InputField, Space } from 'ui'
import { InputSwitch } from '@/components/PriceCalculator/InputSwitch'
import { Text } from '@/components/Text/Text'
import { formatInputDateValue } from '@/utils/date'
import { FormElement } from '../PurchaseForm.constants'

export type CancellationOption = { type: 'NONE' } | { type: 'IEX'; companyName: string }

type Props = {
  option: CancellationOption
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

type NoCancellationProps = Pick<Props, 'onStartDateChange'>

const NoCancellation = ({ onStartDateChange }: NoCancellationProps) => {
  return <StartDateInput onChange={onStartDateChange} />
}

type IEXCancellationProps = Pick<Props, 'onStartDateChange' | 'onAutoSwitchChange'> & {
  companyName: string
}

const IEXCancellation = (props: IEXCancellationProps) => {
  const { onStartDateChange, onAutoSwitchChange, companyName } = props
  const { t } = useTranslation('purchase-form')
  const [checked, setChecked] = useState(false)
  const handleCheckedChange = (newValue: boolean) => {
    setChecked(newValue)
    onAutoSwitchChange?.(newValue)
  }

  return (
    <Space y={0.5}>
      <Space y={0.5}>
        <InputSwitch
          name={FormElement.AutoSwitch}
          label={t('AUTO_SWITCH_FIELD_LABEL')}
          checked={checked}
          onCheckedChange={handleCheckedChange}
        />
        {checked && (
          <Text as="p" size="s">
            {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: companyName })}
          </Text>
        )}
      </Space>

      {!checked && <StartDateInput onChange={onStartDateChange} />}
    </Space>
  )
}

type StartDateInputProps = { onChange?: (date: Date) => void }

const StartDateInput = ({ onChange }: StartDateInputProps) => {
  const { t } = useTranslation('purchase-form')
  const dateToday = new Date()
  const [value, setValue] = useState(dateToday)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.valueAsDate) {
      setValue(event.target.valueAsDate)
      onChange?.(event.target.valueAsDate)
    }
  }

  const inputValue = formatInputDateValue(value)
  const inputValueToday = formatInputDateValue(dateToday)
  const isToday = inputValue === inputValueToday

  return (
    <InputField
      type="date"
      name={FormElement.StartDate}
      label={t('START_DATE_FIELD_LABEL')}
      required
      value={inputValue}
      min={inputValueToday}
      onChange={handleChange}
      infoMessage={isToday ? t('START_DATE_FIELD_TODAY') : undefined}
    />
  )
}
