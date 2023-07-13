import isPropValid from '@emotion/is-prop-valid'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { theme } from '../../lib/theme/theme'

type OverlayProps = {
  frosted?: boolean
}

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'scale(.96)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
})

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  shouldForwardProp: isPropValid,
})<OverlayProps>(({ frosted }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  position: 'fixed',
  inset: 0,
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },

  ...(frosted && {
    backgroundColor: 'rgba(250, 250, 250, 0.75)',
    backdropFilter: 'blur(64px)',
  }),
}))

export const Window = styled.div({
  backgroundColor: theme.colors.white,
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

type ContentProps = {
  children: React.ReactNode
  onClose?: () => void
  className?: string
  frostedOverlay?: boolean
  centerContent?: boolean
}

export const Content = (props: ContentProps) => {
  const handleClose = () => props.onClose?.()

  return (
    <DialogPrimitive.Portal>
      <StyledOverlay frosted={props.frostedOverlay} />

      <StyledContentWrapper center={props.centerContent ?? false}>
        <DialogPrimitive.Content
          className={props.className}
          onEscapeKeyDown={handleClose}
          onInteractOutside={handleClose}
        >
          {props.children}
        </DialogPrimitive.Content>
      </StyledContentWrapper>
    </DialogPrimitive.Portal>
  )
}

const StyledContentWrapper = styled.div<{ center: boolean }>(
  {
    position: 'fixed',
    inset: 0,
  },
  ({ center }) =>
    center && {
      display: 'flex',
      justifyContent: 'center',
      overflowY: 'auto',
    },
)

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Close = DialogPrimitive.Close
