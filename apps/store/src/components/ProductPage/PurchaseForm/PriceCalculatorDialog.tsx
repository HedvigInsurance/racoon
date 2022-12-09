import styled from '@emotion/styled'
import { CrossIcon, Space, Dialog } from 'ui'

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceCalculatorDialog = ({ children, header, isOpen, toggleDialog }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleDialog}>
      <Dialog.Content frostedOverlay>
        <ContentWrapper>
          <Dialog.Close asChild>
            <IconButton>
              <CrossIcon size="1.25rem" />
            </IconButton>
          </Dialog.Close>
          <Space y={4}>
            <HeaderWrapper>{header}</HeaderWrapper>
            {children}
          </Space>
        </ContentWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const HeaderWrapper = styled.div(({ theme }) => ({
  paddingTop: theme.space[8],
}))

const ContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
  padding: theme.space[4],
  backgroundColor: 'transparent',
}))

export const IconButton = styled.button({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '1rem',
  lineHeight: 0,
  cursor: 'pointer',
})
