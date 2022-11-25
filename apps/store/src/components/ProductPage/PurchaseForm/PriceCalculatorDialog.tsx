import styled from '@emotion/styled'
import { CrossIcon, Space, Dialog } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

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
          <Space y={1}>
            <SpaceFlex space={1} align="center" direction="vertical">
              {header}
            </SpaceFlex>
            {children}
          </Space>
        </ContentWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const ContentWrapper = styled(Dialog.Window)(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  alignContent: 'center',
  width: '100vw',
  height: '100vh',
  overflow: 'auto',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
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
