import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { ToggleCard } from 'ui'

type Props = ComponentProps<typeof ToggleCard.Root> & {
  companyName: string
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const AutoSwitchToggleCard = ({
  companyName,
  checked,
  onCheckedChange,
  ...props
}: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <ToggleCard.Root {...props}>
      <ToggleCard.Label>{t('AUTO_SWITCH_FIELD_LABEL')}</ToggleCard.Label>
      <ToggleCard.Switch checked={checked} onCheckedChange={onCheckedChange} />

      <ToggleCard.Description>
        {t('AUTO_SWITCH_FIELD_MESSAGE', { COMPANY: companyName })}
      </ToggleCard.Description>
    </ToggleCard.Root>
  )
}
