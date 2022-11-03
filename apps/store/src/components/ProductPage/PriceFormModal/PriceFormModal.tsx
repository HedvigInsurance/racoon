import styled from '@emotion/styled'
import { Space } from 'ui'
import * as Dialog from '@/components/Dialog/Dialog'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  header?: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  toggleDialog: (open: boolean) => void
}

export const PriceFormModal = ({ children, header, isOpen, toggleDialog }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleDialog}>
      <Dialog.Content>
        <PriceFormWrapper>
          <Space y={5}>
            <SpaceFlex space={1} align="center" direction="vertical">
              {header}
            </SpaceFlex>
            {children}
          </Space>
        </PriceFormWrapper>
      </Dialog.Content>
    </Dialog.Root>
  )
}
const PriceFormWrapper = styled(Dialog.Window)(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  alignContent: 'center',
  width: '100vw',
  height: '100vh',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  backgroundColor: theme.colors.light,
}))
