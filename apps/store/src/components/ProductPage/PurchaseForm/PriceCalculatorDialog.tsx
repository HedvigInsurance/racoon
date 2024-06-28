import { type ReactNode } from 'react'
import { CrossIcon, Dialog } from 'ui'
import { AnimateContentWrapper } from '@/components/FullscreenDialog/FullscreenDialog'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { dialogContent, dialogTitle, iconButton } from './PriceCalculatorDialog.css'

type Props = {
  header?: ReactNode
  children: ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceCalculatorDialog = ({ children, header, isOpen, toggleDialog }: Props) => {
  const handleOpenChange = (open: boolean) => {
    sendDialogEvent(open ? 'open' : 'close')
    toggleDialog(open)
  }

  // TODO: Can we use FullscreenDialog instead?
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content className={dialogContent} frostedOverlay>
        <Dialog.Close asChild>
          <button className={iconButton}>
            <CrossIcon size="1.625rem" />
          </button>
        </Dialog.Close>
        <AnimateContentWrapper>
          <Dialog.Title className={dialogTitle}>{header}</Dialog.Title>
          {children}
        </AnimateContentWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
