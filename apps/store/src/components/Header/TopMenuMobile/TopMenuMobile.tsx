import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { CrossIcon, mq } from 'ui'
import { focusableStyles, Navigation, NavigationPrimaryList } from '../HeaderStyles'

export const IconButton = styled.button({
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  lineHeight: 0,
  ...focusableStyles,
  [mq.lg]: {
    display: 'none',
  },
})

export const ToggleMenu = styled.button({
  ...focusableStyles,
  '&[data-state=open]': {
    visibility: 'hidden',
  },
  [mq.lg]: {
    display: 'none',
  },
})

export const DialogCloseIcon = styled(DialogPrimitive.DialogClose)({
  position: 'fixed',
})

export type TopMenuMobileProps = {
  isOpen?: boolean
  children: React.ReactNode
}

export const TopMenuMobile = ({ children }: TopMenuMobileProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const closeDialog = () => setOpen(false)
    router.events.on('routeChangeComplete', closeDialog)
    return () => router.events.off('routeChangeComplete', closeDialog)
  }, [router.events])

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={() => setOpen((prevOpen) => !prevOpen)}>
        <DialogPrimitive.Trigger asChild>Menu</DialogPrimitive.Trigger>

        <DialogContent>
          <Navigation>
            <NavigationPrimaryList>{children}</NavigationPrimaryList>
          </Navigation>

          <DialogCloseIcon asChild>
            <IconButton>
              <CrossIcon />
            </IconButton>
          </DialogCloseIcon>
        </DialogContent>
      </DialogPrimitive.Root>
    </>
  )
}

export const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
})

export const DialogContent = (props: DialogPrimitive.DialogContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <StyledDialogOverlay />
      <DialogPrimitive.Content {...props} />
    </DialogPrimitive.Portal>
  )
}
