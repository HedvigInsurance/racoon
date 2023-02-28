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
  | {
      type: ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate
      companyName: string
    }

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

    case ExternalInsuranceCancellationOption.BanksigneringInvalidRenewalDate:
      return (
        <BankSigneringInvalidStartDateCancellation {...props} companyName={option.companyName} />
      )

    case ExternalInsuranceCancellationOption.None:
      return <NoCancellation {...props} />
  }
}

type NoCancellationProps = Pick<Props, 'onStartDateChange' | 'startDate'>

const NoCancellation = ({ onStartDateChange, startDate, ...props }: NoCancellationProps) => {
  return <SmartDateInput {...props} date={startDate} onChange={onStartDateChange} />
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

      {!requested && <SmartDateInput date={props.startDate} onChange={onStartDateChange} />}
    </Space>
  )
}

type BankSigneringCancellationProps = Pick<
  Props,
  'onStartDateChange' | 'onAutoSwitchChange' | 'startDate'
> & {
  companyName: string
  requested: boolean
}

const BankSigneringCancellation = (props: BankSigneringCancellationProps) => {
  const { onAutoSwitchChange, companyName, requested, onStartDateChange } = props
  const { t } = useTranslation('purchase-form')

  const handleCheckedChange = (newValue: boolean) => {
    onAutoSwitchChange?.(newValue)
  }

  const startDateLabel = t('AUTO_SWITCH_START_DATE_LABEL', { company: companyName })

  return (
    <Space y={0.25}>
      <AutoSwitchInput
        value={requested}
        onCheckedChange={handleCheckedChange}
        companyName={companyName}
      />

      {requested ? (
        <SmartDateInput
          label={startDateLabel}
          date={props.startDate}
          onChange={onStartDateChange}
        />
      ) : (
        <SmartDateInput date={props.startDate} onChange={props.onStartDateChange} />
      )}
    </Space>
  )
}

type BankSigneringInvalidStartDateProps = Pick<Props, 'onStartDateChange' | 'startDate'> & {
  companyName: string
}

const BankSigneringInvalidStartDateCancellation = (props: BankSigneringInvalidStartDateProps) => {
  const { onStartDateChange, startDate } = props
  // TODO: figure out how to get back to BANKSIGNERING option
  // Right now, if the user ends up here, they can't go back to the BANKSIGNERING...
  const handleChange = (date: Date) => {
    onStartDateChange?.(date)
  }

  return <SmartDateInput {...props} date={startDate} onChange={handleChange} />
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

type SmartDateInputProps = {
  label?: string
  date?: Date
  onChange?: (date: Date) => void
}

const SmartDateInput = ({ label, date, onChange }: SmartDateInputProps) => {
  const { t } = useTranslation('purchase-form')
  const dateToday = new Date()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.valueAsDate) {
      onChange?.(event.target.valueAsDate)
    }
  }

  const inputValue = date ? formatInputDateValue(date) : undefined
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
    />
  )
}
