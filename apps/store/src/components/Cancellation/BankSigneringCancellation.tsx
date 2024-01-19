import { useTranslation } from 'next-i18next'
import { Space } from 'ui'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { useFormatter } from '@/utils/useFormatter'
import { AutoSwitchToggleCard } from './AutoSwitchToggleCard'

type Props = {
  startDate?: Date
  onStartDateChange: (date: Date) => void
  requested: boolean
  onAutoSwitchChange?: (checked: boolean) => void
  companyName: string
  loading?: boolean
}

export const BankSigneringCancellation = (props: Props) => {
  const { t } = useTranslation('purchase-form')

  const handleCheckedChange = (newValue: boolean) => {
    props.onAutoSwitchChange?.(newValue)
  }

  const formatter = useFormatter()
  const formattedCompanyName = formatter.titleCase(props.companyName)
  const autoSwitchLabel = t('AUTO_SWITCH_START_DATE_LABEL', { company: formattedCompanyName })

  return (
    <Space y={0.25}>
      <AutoSwitchToggleCard
        checked={props.requested}
        onCheckedChange={handleCheckedChange}
        companyName={props.companyName}
      />
      <InputStartDay
        date={props.startDate}
        onChange={props.onStartDateChange}
        label={props.requested ? autoSwitchLabel : undefined}
        loading={props.loading}
      />
    </Space>
  )
}
