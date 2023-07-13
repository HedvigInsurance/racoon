import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { CheckIcon, Dialog, Space, Text, theme } from 'ui'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'

export const DebugDialog = () => {
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const ctrl = event.getModifierState('Control')
      if (ctrl && event.key === 'd') {
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <DialogContent onClose={() => setOpen(false)}>
        <DialogWindow>
          <ShopSessionSection />
        </DialogWindow>
      </DialogContent>
    </Dialog.Root>
  )
}

const DialogContent = styled(Dialog.Content)({
  maxWidth: '100%',
  display: 'flex',
  alignItems: 'center',
})

const DialogWindow = styled(Dialog.Window)({
  padding: theme.space.lg,
  paddingTop: theme.space.md,
  borderBottomRightRadius: theme.radius.sm,
  borderBottomLeftRadius: theme.radius.sm,
  maxWidth: `calc(100% - ${theme.space.xs} * 2)`,
  marginInline: 'auto',
})

const ShopSessionSection = () => {
  const { shopSession } = useShopSession()

  if (!shopSession) return null

  return (
    <Space y={0.25}>
      <Text as="p" size="sm">
        Shop Session
      </Text>
      <CopyToClipboard>{shopSession.id}</CopyToClipboard>
    </Space>
  )
}

const CopyToClipboard = (props: { children: string }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(props.children)
    setCopied(true)
  }

  return (
    <CopyToClipboardWrapper>
      <Elipsis as="p" size="sm">
        {props.children}
      </Elipsis>
      <CopyToClipboardButton onClick={copy}>
        {copied ? (
          <SpaceFlex align="center" space={0.5}>
            <CheckIcon size="1em" />
            Copied
          </SpaceFlex>
        ) : (
          'Copy'
        )}
      </CopyToClipboardButton>
    </CopyToClipboardWrapper>
  )
}

const CopyToClipboardWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.lg,

  backgroundColor: theme.colors.gray100,
  padding: theme.space.xs,
  borderRadius: theme.radius.xs,
  border: `1px solid ${theme.colors.gray300}`,

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.gray200,
    },
  },
})

const Elipsis = styled(Text)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const CopyToClipboardButton = styled.button({
  cursor: 'pointer',
  flexShrink: 0,
})
