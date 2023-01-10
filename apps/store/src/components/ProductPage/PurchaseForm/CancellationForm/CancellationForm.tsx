import { useTranslation } from 'next-i18next'
import { ChangeEventHandler } from 'react'
import { Space, Text } from 'ui'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { formatInputDateValue } from '@/utils/date'
import { FormElement } from '../PurchaseForm.constants'
import { DateInput } from './DateInput'

export type CancellationOption =
  | { type: ExternalInsuranceCancellationOption.None; message?: string }
  | { type: ExternalInsuranceCancellationOption.Iex; companyName: string; requested: boolean }
  | {
      type: ExternalInsuranceCancellationOption.Banksignering
      companyName: string
      requested: boolean
    }
  | { type: ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate; companyName: string }

type Props = {
  option: CancellationOption
  startDate: Date
  onStartDateChange?: (date: Date) => void
  onAutoSwitchChange?: (checked: boolean) => void
}

export const CancellationForm = ({ option, ...props }: Props) => {
  switch (option.type) {
    case ExternalInsuranceCancellationOption.Iex:
      return (
        <IEXCancellation {...props} companyName={option.companyName} requested={option.requested} />
      )

    case ExternalInsuranceCancellationOption.Banksignering:
      return (
        <BankSigneringCancellation
          {...props}
          companyName={option.companyName}
          requested={option.requested}
        />
      )

    case ExternalInsuranceCancellationOption.BanksigneringInvalidStartDate:
      return (
        <BankSigneringInvalidStartDateCancellation {...props} companyName={option.companyName} />
      )

    case ExternalInsuranceCancellationOption.None:
      return <NoCancellation {...props} />
  }
}

type NoCancellationProps = Pick<Props, 'onStartDateChange'> & {
  startDate: Date
}

const NoCancellation = ({ onStartDateChange, ...props }: NoCancellationProps) => {
  return <StartDateInput {...props} onChange={onStartDateChange} />
}

type IEXCancellationProps = Pick<
  Props,
  'onStartDateChange' | 'onAutoSwitchChange' | 'startDate'
> & {
  companyName: string
  requested: boolean
}

const IEXCancellation = (props: IEXCancellationProps) => {
  const { onStartDateChange, onAutoSwitchChange, companyName, requested } = props
  const handleCheckedChange = (newValue: boolean) => {
    onAutoSwitchChange?.(newValue)
  }

  return (
    <Space y={0.25}>
      <AutoSwitchInput
        value={requested}
        onCheckedChange={handleCheckedChange}
        companyName={companyName}
      />

      {!requested && <StartDateInput startDate={props.startDate} onChange={onStartDateChange} />}
    </Space>
  )
}

type BankSigneringCancellationProps = IEXCancellationProps

const BankSigneringCancellation = (props: BankSigneringCancellationProps) => {
  const { onStartDateChange, onAutoSwitchChange, companyName, requested } = props
  const { t } = useTranslation('purchase-form')

  const handleCheckedChange = (newValue: boolean) => {
    onAutoSwitchChange?.(newValue)
  }

  const renewalDateLabel = t('AUTO_SWITCH_RENEWAL_DATE_LABEL', { company: companyName })

  return (
    <Space y={0.25}>
      <AutoSwitchInput
        value={requested}
        onCheckedChange={handleCheckedChange}
        companyName={companyName}
      />

      <StartDateInput
        label={requested ? renewalDateLabel : undefined}
        startDate={props.startDate}
        onChange={onStartDateChange}
      />
    </Space>
  )
}

type BankSigneringInvalidStartDateProps = Pick<Props, 'onStartDateChange'> & {
  startDate: Date
  companyName: string
}

const BankSigneringInvalidStartDateCancellation = (props: BankSigneringInvalidStartDateProps) => {
  const { onStartDateChange, companyName } = props
  const { t } = useTranslation('purchase-form')
  const message = t('AUTO_SWITCH_INVALID_START_DATE_MESSAGE', { company: companyName })
  return <StartDateInput {...props} onChange={onStartDateChange} message={message} />
}

type AutoSwitchInputProps = {
  onCheckedChange: (checked: boolean) => void
  value: boolean
  companyName: string
}

const AutoSwitchInput = ({ onCheckedChange, value, companyName }: AutoSwitchInputProps) => {
  const { t } = useTranslation('purchase-form')

  return (
    <ToggleCard
      name={FormElement.AutoSwitch}
      label={t('AUTO_SWITCH_FIELD_LABEL')}
      defaultChecked={value}
      onCheckedChange={onCheckedChange}
    >
      {value && (
        <Text as="p" size="sm" color="textSecondary">
          {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: companyName })}
        </Text>
      )}
    </ToggleCard>
  )
}

type StartDateInputProps = {
  label?: string
  message?: string
  startDate: Date
  onChange?: (date: Date) => void
}

const StartDateInput = ({ label, message, startDate, onChange }: StartDateInputProps) => {
  const { t } = useTranslation('purchase-form')
  const dateToday = new Date()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.valueAsDate) {
      onChange?.(event.target.valueAsDate)
    }
  }

  const inputValue = formatInputDateValue(startDate)
  const inputValueToday = formatInputDateValue(dateToday)

  return (
    <DateInput
      type="date"
      name={FormElement.StartDate}
      label={label ?? t('START_DATE_FIELD_LABEL')}
      required
      value={inputValue}
      min={inputValueToday}
      onChange={handleChange}
    >
      {message}
    </DateInput>
  )
}
