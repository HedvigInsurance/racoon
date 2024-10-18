import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState, type ReactNode } from 'react'
import { Dialog } from 'ui/src/components/Dialog/Dialog'
import { CrossIconSmall, Space, mq, theme } from 'ui'

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
        <TextButton>{t('QUICK_ADD_INCLUDED_DIALOG_BUTTON')}</TextButton>
      </Dialog.Trigger>
      <DialogContent centerContent={true} frostedOverlay={true}>
        <ScrollWrapper>
          <CloseButton onClick={() => setOpen(false)}>
            <CrossIconSmall size="1rem" />
          </CloseButton>
          <Space y={4}>
            {Header && <DialogHeader>{Header}</DialogHeader>}
            <DialogBody>{children}</DialogBody>
          </Space>
        </ScrollWrapper>
      </DialogContent>
    </Dialog.Root>
  )
}

// Use dvh when the browser supports it to make the dialog proper height in mobile
const DIALOG_HEIGHT = [
  `min(45rem, calc(100vh - ${theme.space.xl}))`,
  `min(45rem, calc(100dvh - ${theme.space.xl}))`,
]

const DialogContent = styled(Dialog.Content)({
  position: 'relative',
  alignSelf: 'center',
  width: `min(35.5rem, calc(100vw - ${theme.space.xl}))`,
  height: DIALOG_HEIGHT,
  paddingInline: theme.space.md,
  backgroundColor: theme.colors.backgroundStandard,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.borderTranslucent1}`,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',
  overflow: 'hidden',

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
})

const ScrollWrapper = styled.div({
  height: DIALOG_HEIGHT,
  overflow: 'auto',
  // Hide scrollbar in Dialog
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },

  [mq.md]: {
    paddingInline: theme.space.lg,
  },
})

const DialogHeader = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '4.5rem',
})

const DialogBody = styled.div({
  paddingBottom: theme.space.xl,

  [mq.md]: {
    paddingBottom: theme.space.xxl,
  },
})

const TextButton = styled.button({
  cursor: 'pointer',
  textDecoration: 'underline',

  '&:focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  '@media (hover: hover)': {
    '&:hover': {
      textDecorationColor: theme.colors.textPrimary,
    },
  },
})

const CloseButton = styled.button({
  position: 'absolute',
  top: theme.space.md,
  right: theme.space.md,
  padding: theme.space.xs,
  borderRadius: '100%',
  backgroundColor: theme.colors.translucent1,
  cursor: 'pointer',
  zIndex: 1,
  backdropFilter: 'blur(30px)',

  '&:hover': {
    backgroundColor: theme.colors.translucent2,
  },
})
