import { useTranslation } from 'next-i18next'
import { Space, Text } from 'ui'
import { InputStartDate } from '@/components/InputDate/InputStartDate'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'
import { ExternalInsuranceCancellationOption } from '@/services/graphql/generated'
import { Features } from '@/utils/Features'
import { useFormatter } from '@/utils/useFormatter'
import { SelfSwitcherBubble } from './SelfSwitcherBubble'

const USE_DAY_PICKER = Features.enabled('DAY_PICKER')
const StartDatePicker = USE_DAY_PICKER ? InputStartDay : InputStartDate

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

  return <StartDatePicker {...props} date={date} onChange={onStartDateChange} />
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

      {!requested && <StartDatePicker date={date} onChange={onStartDateChange} />}
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

  if (props.invalidRenewalDate) {
    return (
      <Space y={0.25}>
        <StartDatePicker date={date} onChange={props.onStartDateChange} />
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
      <StartDatePicker
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
