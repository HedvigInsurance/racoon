import { Space } from 'ui'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { AutoSwitchToggleCard } from './AutoSwitchToggleCard'

type Props = {
  requested: boolean
  onAutoSwitchChange?: (checked: boolean) => void
  companyName: string
  startDate?: Date
  onStartDateChange: (date: Date) => void
  loading?: boolean
}

export const IEXCancellation = (props: Props) => {
  return (
    <Space y={0.25}>
      <AutoSwitchToggleCard
        checked={props.requested}
        onCheckedChange={props.onAutoSwitchChange}
        companyName={props.companyName}
      />
      {!props.requested && (
        <InputStartDay
          date={props.startDate}
          onChange={props.onStartDateChange}
          loading={props.loading}
        />
      )}
    </Space>
  )
}
