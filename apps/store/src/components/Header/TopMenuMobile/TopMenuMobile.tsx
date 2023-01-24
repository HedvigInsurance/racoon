import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { Button, mq, theme } from 'ui'
import { focusableStyles, Navigation, NavigationPrimaryList } from '../HeaderStyles'

const triggerStyles = {
  ...focusableStyles,
  fontSize: theme.fontSizes[3],
  marginRight: theme.space[4],
  [mq.lg]: {
    display: 'none',
  },
}

export const DialogTrigger = styled(DialogPrimitive.Trigger)({
  ...triggerStyles,
})

export const DialogClose = styled(DialogPrimitive.DialogClose)({
  ...triggerStyles,
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
        {open ? <DialogClose>Close</DialogClose> : <DialogTrigger>Menu</DialogTrigger>}
        <DialogContent>
          <Navigation>
            <NavigationPrimaryList>{children}</NavigationPrimaryList>
          </Navigation>
          <Button variant="secondary" size="medium">
            App Store
          </Button>
          <Button variant="secondary" size="medium">
            Google Play
          </Button>
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
