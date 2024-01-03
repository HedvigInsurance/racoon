import { useTranslation } from 'next-i18next'
import { Space, Text } from 'ui'
import { InputStartDay } from '@/components/InputDay/InputStartDay'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'

type Props = {
  requested: boolean
  onAutoSwitchChange?: (checked: boolean) => void
  companyName: string
  startDate?: Date
  onStartDateChange: (date: Date) => void
}

export const IEXCancellation = (props: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Space y={0.25}>
      <ToggleCard
        label={t('AUTO_SWITCH_FIELD_LABEL')}
        defaultChecked={props.requested}
        onCheckedChange={props.onAutoSwitchChange}
      >
        {props.requested && (
          <Text as="p" size="xs" color="textSecondary">
            {t('AUTO_SWITCH_FIELD_MESSAGE', {
              COMPANY: props.companyName,
            })}
          </Text>
        )}
      </ToggleCard>
      {!props.requested && (
        <InputStartDay date={props.startDate} onChange={props.onStartDateChange} />
      )}
    </Space>
  )
}
