import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react'
import { Button, Dialog, Text } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import {
  consentDialogContent,
  consentDialogMessage,
  consentDialogWindow,
} from './MyMoneyConsentConfirmation.css'

type Props = {
  onClose: () => void
  onContinue: () => void
  loading?: boolean
} & PropsWithChildren<ComponentPropsWithoutRef<typeof Dialog.Root>>

export function MyMoneyConsentConfirmation({ children, loading, onClose, onContinue }: Props) {
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root onOpenChange={handleClose}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content centerContent={true} className={consentDialogContent}>
        <Dialog.Window className={consentDialogWindow}>
          <div className={consentDialogMessage}>
            <Dialog.Title asChild>
              <Text size="md">Vill du gå vidare utan erbjudandet?</Text>
            </Dialog.Title>
            <Dialog.Description asChild>
              <Text size="md" color="textSecondary">
                Sambla ger dig förmånliga räntor på ditt existerande billån.
              </Text>
            </Dialog.Description>
          </div>

          <SpaceFlex space={0.5} direction="vertical">
            <Dialog.Close asChild>
              <Button>Gå tillbaka</Button>
            </Dialog.Close>

            <Button onClick={onContinue} loading={loading} variant="ghost">
              Fortsätt utan erbjudande
            </Button>
          </SpaceFlex>
        </Dialog.Window>
      </Dialog.Content>
    </Dialog.Root>
  )
}
