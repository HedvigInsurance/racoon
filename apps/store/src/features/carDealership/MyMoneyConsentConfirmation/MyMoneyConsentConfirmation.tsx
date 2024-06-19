import { useTranslation } from 'next-i18next'
import type { ComponentPropsWithoutRef } from 'react'
import { Button, Dialog, InfoIcon, Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  consentDialogContent,
  consentDialogIcon,
  consentDialogMessage,
  consentDialogWindow,
} from './MyMoneyConsentConfirmation.css'

type Props = {
  onClose: () => void
  onContinue: () => void
  loading?: boolean
} & ComponentPropsWithoutRef<typeof Dialog.Root>

export function MyMoneyConsentConfirmation({ children, loading, onClose, onContinue }: Props) {
  const { t } = useTranslation('carDealership')

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content centerContent={true} className={consentDialogContent}>
        <Dialog.Window className={consentDialogWindow}>
          <div className={consentDialogMessage}>
            <InfoIcon size="1.5rem" className={consentDialogIcon} />
            <Dialog.Title asChild>
              <Text size="md">{t('MY_MONEY_CONSENT_CONFIRMATION_TITLE')}</Text>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Text size="md" color="textSecondary">
                {t('MY_MONEY_CONSENT_CONFIRMATION_DESCRIPTION')}
              </Text>
            </Dialog.Description>
          </div>

          <SpaceFlex space={0.5} direction="vertical">
            <Dialog.Close asChild>
              <Button fullWidth={true}>{t('MY_MONEY_CONSENT_CONFIRMATION_BACK_BUTTON')}</Button>
            </Dialog.Close>

            <Button fullWidth={true} onClick={onContinue} loading={loading} variant="ghost">
              {t('MY_MONEY_CONSENT_CONFIRMATION_CONTINUE_BUTTON')}
            </Button>
          </SpaceFlex>
        </Dialog.Window>
      </Dialog.Content>
    </Dialog.Root>
  )
}
