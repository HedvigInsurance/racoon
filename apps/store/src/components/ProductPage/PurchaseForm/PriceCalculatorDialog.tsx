import styled from '@emotion/styled'
import { CrossIcon, Space, Dialog, theme } from 'ui'
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
        <Dialog.Close asChild>
          <IconButton>
            <CrossIcon size="1.625rem" />
          </IconButton>
        </Dialog.Close>
        <Space y={4}>
          <HeaderWrapper>{header}</HeaderWrapper>
          {children}
        </Space>
      </DialogContent>
    </Dialog.Root>
  )
}

const HeaderWrapper = styled.div({
  paddingTop: theme.space.xxxl,
})

const DialogContent = styled(Dialog.Content)({
  position: 'relative',
  height: '100%',
  overflow: 'auto',
  padding: theme.space.md,
  backgroundColor: 'transparent',
})

export const IconButton = styled.button({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '1rem',
  lineHeight: 0,
  cursor: 'pointer',
})
