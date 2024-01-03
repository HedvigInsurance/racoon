import { useTranslation } from 'next-i18next'
import { Space } from 'ui'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { useFormatter } from '@/utils/useFormatter'
import { InfoCard } from '../InfoCard/InfoCard'

type Props = {
  startDate: Date
  onStartDateChange: (date: Date) => void
  loading?: boolean
}

export const BankSigneringInvalidRenewalDateCancellation = (props: Props) => {
  const { t } = useTranslation('purchase-form')

  const formatter = useFormatter()
  const formattedDate = formatter.fromNow(props.startDate)

  return (
    <Space y={0.25}>
      <InputStartDay
        date={props.startDate}
        onChange={props.onStartDateChange}
        loading={props.loading}
      />
      <InfoCard>{t('SELF_SWICHER_MESSAGE', { date: formattedDate })}</InfoCard>
    </Space>
  )
}
