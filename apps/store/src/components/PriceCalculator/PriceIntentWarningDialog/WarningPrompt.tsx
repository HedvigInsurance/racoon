import { useTranslation } from 'next-i18next'
import { Button, InfoIcon, Text, theme, Dialog, yStack } from 'ui'
import type { PriceIntentWarning } from '@/services/graphql/generated'

type Props = {
  onClickConfirm: () => void
  onClickEdit: () => void
} & PriceIntentWarning

export const WarningPrompt = ({ header, message, onClickConfirm, onClickEdit }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <div
      className={yStack({
        paddingTop: 'xl',
        paddingLeft: 'md',
        paddingRight: 'md',
        paddingBottom: 'md',
        textAlign: 'center',
        gap: 'lg',
      })}
    >
      <div className={yStack({ gap: 'md', alignItems: 'center' })}>
        <InfoIcon size="1.5rem" color={theme.colors.signalBlueElement} />
        <div>
          <Dialog.Title asChild={true}>
            <Text balance={true}>{header}</Text>
          </Dialog.Title>
          <Text color="textSecondary" balance={true}>
            {message}
          </Text>
        </div>
      </div>

      <div className={yStack({ gap: 'xxs' })}>
        <Button onClick={onClickConfirm} fullWidth={true}>
          {t('PRICE_INTENT_WARNING_ACCEPT_BUTTON_LABEL')}
        </Button>
        <Button onClick={onClickEdit} variant="ghost" fullWidth={true}>
          {t('PRICE_INTENT_WARNING_EDIT_BUTTON_LABEL')}
        </Button>
      </div>
    </div>
  )
}
