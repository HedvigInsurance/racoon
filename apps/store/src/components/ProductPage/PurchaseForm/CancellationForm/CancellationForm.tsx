import { useTranslation } from 'next-i18next'
import { ChangeEventHandler } from 'react'
import { Space, Text } from 'ui'
import { InputDate } from '@/components/InputDate/InputDate'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'
import { ExternalInsuranceCancellationOption } from '@/services/apollo/generated'
import { formatInputDateValue } from '@/utils/date'
import { useFormatter } from '@/utils/useFormatter'
import { FormElement } from '../PurchaseForm.constants'
import { SelfSwitcherBubble } from './SelfSwitcherBubble'

export type CancellationOption =
  | { type: ExternalInsuranceCancellationOption.None; message?: string }
  | { type: ExternalInsuranceCancellationOption.Iex; companyName: string; requested: boolean }
  | {
      type: ExternalInsuranceCancellationOption.Banksignering
      companyName: string
      requested: boolean
      invalidRenewalDate: Date | null
    }

type Props = {
  option: CancellationOption
  startDate: Date | null
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
          invalidRenewalDate={option.invalidRenewalDate}
        />
      )

    case ExternalInsuranceCancellationOption.None:
      return <NoCancellation {...props} />
  }
}

type NoCancellationProps = Pick<Props, 'onStartDateChange' | 'startDate'>

const NoCancellation = ({ onStartDateChange, startDate, ...props }: NoCancellationProps) => {
  const date = startDate ?? new Date()

  return <SmartDateInput {...props} date={date} onChange={onStartDateChange} />
}

type IEXCancellationProps = Pick<
  Props,
  'onStartDateChange' | 'onAutoSwitchChange' | 'startDate'
> & {
  companyName: string
  requested: boolean
}

const IEXCancellation = (props: IEXCancellationProps) => {
  const { onStartDateChange, onAutoSwitchChange, companyName, requested, startDate } = props
  const handleCheckedChange = (newValue: boolean) => {
    onAutoSwitchChange?.(newValue)
  }
  const date = startDate ?? new Date()

  return (
    <Space y={0.25}>
      <AutoSwitchInput
        value={requested}
        onCheckedChange={handleCheckedChange}
        companyName={companyName}
      />

      {!requested && <SmartDateInput date={date} onChange={onStartDateChange} />}
    </Space>
  )
}

type BankSigneringCancellationProps = Pick<
  Props,
  'onStartDateChange' | 'onAutoSwitchChange' | 'startDate'
> & {
  companyName: string
  requested: boolean
  invalidRenewalDate: Date | null
}

const BankSigneringCancellation = (props: BankSigneringCancellationProps) => {
  const { t } = useTranslation('purchase-form')

  const date = props.startDate ?? undefined

  const handleCheckedChange = (newValue: boolean) => {
    props.onAutoSwitchChange?.(newValue)
  }

  const formatter = useFormatter()
  const formattedCompanyName = formatter.titleCase(props.companyName)
  const autoSwitchLabel = t('AUTO_SWITCH_START_DATE_LABEL', { company: formattedCompanyName })

  if (props.requested && props.invalidRenewalDate) {
    return (
      <Space y={0.25}>
        <SmartDateInput date={date} onChange={props.onStartDateChange} />
        <SelfSwitcherBubble date={props.invalidRenewalDate} />
      </Space>
    )
  }

  return (
    <Space y={0.25}>
      <AutoSwitchInput
        value={props.requested}
        onCheckedChange={handleCheckedChange}
        companyName={props.companyName}
      />
      <SmartDateInput
        date={date}
        onChange={props.onStartDateChange}
        label={props.requested ? autoSwitchLabel : undefined}
      />
    </Space>
  )
}

type AutoSwitchInputProps = {
  onCheckedChange: (checked: boolean) => void
  value: boolean
  companyName: string
}

const AutoSwitchInput = ({ onCheckedChange, value, companyName }: AutoSwitchInputProps) => {
  const { t } = useTranslation('purchase-form')
  const formatter = useFormatter()

  const formattedCompanyName = formatter.titleCase(companyName)

  return (
    <ToggleCard
      name={FormElement.AutoSwitch}
      label={t('AUTO_SWITCH_FIELD_LABEL')}
      defaultChecked={value}
      onCheckedChange={onCheckedChange}
    >
      {value && (
        <Text as="p" size="xs" color="textSecondary">
          {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: formattedCompanyName })}
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
    <InputDate
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
