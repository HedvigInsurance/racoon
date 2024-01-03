import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'

type Props = Omit<ComponentProps<typeof ToggleCard>, 'label'> & {
  companyName: string
}

export const AutoSwitchToggleCard = ({ checked, companyName, ...props }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <ToggleCard {...props} label={t('AUTO_SWITCH_FIELD_LABEL')} defaultChecked={checked}>
      {checked && (
        <Text as="p" size="xs" color="textSecondary">
          {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: companyName })}
        </Text>
      )}
    </ToggleCard>
  )
}
