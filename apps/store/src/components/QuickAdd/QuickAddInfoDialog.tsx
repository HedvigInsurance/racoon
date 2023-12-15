import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState, type ReactNode } from 'react'
import { Button, CrossIcon, Dialog, Space, mq, theme } from 'ui'

type Props = {
  children: ReactNode
  Header?: ReactNode
}

export const QuickAddInfoDialog = ({ children, Header }: Props) => {
  const { t } = useTranslation('cart')
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild={true}>
        <Button size="medium" variant="ghost" fullWidth={true}>
          {t('QUICK_ADD_INCLUDED_DIALOG_BUTTON')}
        </Button>
      </Dialog.Trigger>
      <DialogContent>
        <Wrapper>
          <CloseButton onClick={() => setOpen(false)}>
            <CrossIcon size="1rem" />
          </CloseButton>
          <Space y={1}>
            {Header && <DialogHeader>{Header}</DialogHeader>}
            {children}
          </Space>
        </Wrapper>
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  display: 'grid',
  placeItems: 'center',
  height: '100vh',
})

const Wrapper = styled.div({
  position: 'relative',
  width: 'min(35.5rem, calc(100vw - 2rem))',
  paddingInline: theme.space.md,
  backgroundColor: theme.colors.backgroundStandard,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
})

const DialogHeader = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.space.xl,
})

const CloseButton = styled.button({
  position: 'absolute',
  top: theme.space.md,
  right: theme.space.md,
  padding: theme.space.xxs,
  borderRadius: '100%',
  backgroundColor: theme.colors.translucent2,
  cursor: 'pointer',
  zIndex: 1,
})
