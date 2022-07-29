import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
export { Header } from './Header'

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'scale(.96)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay)({
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const StyledContent = styled(DialogPrimitive.Content)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  width: '100vw',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
}))

type ContentProps = {
  children: React.ReactNode
  Title: React.ReactNode
  onClose?: () => void
}

export const Content = ({ children, Title, onClose }: ContentProps) => {
  const handleClose = () => onClose?.()

  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContent onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
        <DialogPrimitive.Title asChild>{Title}</DialogPrimitive.Title>
        <DialogPrimitive.Description asChild>{children}</DialogPrimitive.Description>
      </StyledContent>
    </DialogPrimitive.Portal>
  )
}

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
