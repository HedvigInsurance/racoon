import styled from '@emotion/styled'
import { CrossIcon, Space, Dialog, theme } from 'ui'

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceCalculatorDialog = ({ children, header, isOpen, toggleDialog }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent frostedOverlay>
        <Dialog.Close asChild>
          <IconButton>
            <CrossIcon size="1.25rem" />
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
