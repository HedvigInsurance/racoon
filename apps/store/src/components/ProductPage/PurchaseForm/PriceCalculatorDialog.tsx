import { type ReactNode } from 'react'
import { CrossIcon, Dialog, Heading, yStack } from 'ui'
import { AnimateContentWrapper } from '@/components/FullscreenDialog/FullscreenDialog'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { sendDialogEvent } from '@/utils/dialogEvent'
import { dialogContent, dialogTitle, iconButton } from './PriceCalculatorDialog.css'

type Props = {
  children: ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceCalculatorDialog = ({ children, isOpen, toggleDialog }: Props) => {
  const productData = useProductData()

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
          <Dialog.Title className={dialogTitle}>
            <div className={yStack({ gap: 'xs', alignItems: 'center' })}>
              <Pillow size="large" {...productData.pillowImage} />
              <Heading as="h2" variant="standard.18">
                {productData.displayNameShort}
              </Heading>
            </div>
          </Dialog.Title>
          {children}
        </AnimateContentWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
