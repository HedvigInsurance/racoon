import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'

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

export const Window = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.white,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
}))

const StyledContentWrapper = styled.div({
  position: 'fixed',
  inset: 0,
  zIndex: 2000,
})

type ContentProps = {
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

export const Content = ({ children, onClose, className }: ContentProps) => {
  const handleClose = () => onClose?.()

  return (
    <DialogPrimitive.Portal>
      <StyledOverlay />
      <StyledContentWrapper className={className}>
        <DialogPrimitive.Content onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
          {children}
        </DialogPrimitive.Content>
      </StyledContentWrapper>
    </DialogPrimitive.Portal>
  )
}

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Close = DialogPrimitive.Close
