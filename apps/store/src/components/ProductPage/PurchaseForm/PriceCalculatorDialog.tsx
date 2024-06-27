import styled from '@emotion/styled'
import { CrossIcon, Space, Dialog, theme } from 'ui'
import { AnimateContentWrapper } from '@/components/FullscreenDialog/FullscreenDialog'
import { sendDialogEvent } from '@/utils/dialogEvent'

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceCalculatorDialog = ({ children, header, isOpen, toggleDialog }: Props) => {
  const handleOpenChange = (open: boolean) => {
    sendDialogEvent(open ? 'open' : 'close')
    toggleDialog(open)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent frostedOverlay>
        <DialogClose asChild>
          <IconButton>
            <CrossIcon size="1.625rem" />
          </IconButton>
        </DialogClose>
        <Space y={4}>
          <AnimateContentWrapper>
            <HeaderWrapper>{header}</HeaderWrapper>
            {children}
          </AnimateContentWrapper>
        </Space>
      </DialogContent>
    </Dialog.Root>
  )
}

const HeaderWrapper = styled(Dialog.Title)({
  paddingTop: theme.space.xxxl,
})

const DialogContent = styled(Dialog.Content)({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
  padding: theme.space.md,
  backgroundColor: 'transparent',
  isolation: 'isolate',
})

const DialogClose = styled(Dialog.Close)({
  zIndex: 1,
})

export const IconButton = styled.button({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '1rem',
  lineHeight: 0,
  cursor: 'pointer',
})
