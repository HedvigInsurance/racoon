import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Popover from '@radix-ui/react-popover'
import { useState, useEffect } from 'react'
import { MinusIcon, CrossIcon, theme } from 'ui'
import * as FullScreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'
import { ContactUsButton } from './ContactUsButton'
import { Content } from './Content'
import { Header } from './Header'

const scaleIn = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1)',
  },
})

const scaleOut = keyframes({
  from: {
    opacity: 1,
    transform: 'scale(1)',
  },
  to: {
    opacity: 0,
    transform: 'scale(0)',
  },
})

export const ContactUs = () => {
  const hasMounted = useHasMounted()
  const isDesktop = useBreakpoint('xs')
  const [open, setOpen] = useState(false)

  // There's no way to determine how this component should look on the server
  if (!hasMounted) return null

  if (isDesktop) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild={true}>
          <ContactUsButton />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content side="bottom" align="end" sideOffset={8} asChild={true}>
            <ChatWindow>
              <Header
                CloseBtn={
                  <Popover.Close asChild={true}>
                    <CloseButton>
                      <MinusIcon size="18px" />
                    </CloseButton>
                  </Popover.Close>
                }
              />

              <Content />
            </ChatWindow>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    )
  }
  return (
    <FullScreenDialog.Root open={open} onOpenChange={setOpen}>
      <FullScreenDialog.Trigger asChild={true}>
        <ContactUsButton />
      </FullScreenDialog.Trigger>

      <FullScreenDialog.Modal
        Header={
          <Header
            CloseBtn={
              <FullScreenDialog.Close asChild={true}>
                <CloseButton>
                  <CrossIcon size="24px" />
                </CloseButton>
              </FullScreenDialog.Close>
            }
          />
        }
      >
        <Content />
      </FullScreenDialog.Modal>
    </FullScreenDialog.Root>
  )
}

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

const ChatWindow = styled.div({
  display: 'grid',
  gridTemplateRows: '55px 1fr',
  height: 500,
  aspectRatio: '4 / 5',
  backgroundColor: theme.colors.offWhite,
  borderRadius: theme.radius.md,
  transformOrigin: 'var(--radix-popover-content-transform-origin)',
  filter: 'drop-shadow(0px 1px 1px hsl(0deg 0% 0% / 0.15))',

  '&[data-state=open]': {
    animation: `${scaleIn} 250ms ${theme.transitions.css.easeInCubic}`,
  },
  '&[data-state=closed]': {
    animation: `${scaleOut} 250ms ${theme.transitions.css.easeOutCubic}`,
  },
})

const CloseButton = styled.button({
  cursor: 'pointer',
})
