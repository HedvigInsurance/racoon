import * as DialogPrimitive from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { forwardRef, PropsWithChildren, ReactNode } from 'react'
import { contentWrapper, dialogWindow, overlay } from './Dialog.css'

type ContentProps = {
  children: ReactNode
  onClose?: () => void
  className?: string
  frostedOverlay?: boolean
  centerContent?: boolean
}

export const Content = (props: ContentProps) => {
  const handleClose = () => props.onClose?.()

  return (
    <DialogPrimitive.Portal>
      <Overlay frosted={props.frostedOverlay} />

      <div className={clsx(contentWrapper.base, props.centerContent && contentWrapper.centered)}>
        <DialogPrimitive.Content
          className={props.className}
          onEscapeKeyDown={handleClose}
          onInteractOutside={handleClose}
        >
          {props.children}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
}

type OverlayProps = {
  frosted?: boolean
}
const Overlay = forwardRef<HTMLDivElement, OverlayProps>(({ frosted }, ref) => {
  return (
    <DialogPrimitive.Overlay ref={ref} className={clsx(overlay.base, frosted && overlay.frosted)} />
  )
})
Overlay.displayName = 'Overlay'

export const Root = DialogPrimitive.Root
export const Trigger = DialogPrimitive.Trigger
export const Close = DialogPrimitive.Close

// Example of exposing base component for further styling by either vanilla-extract or emotion
export const Window = ({
  className,
  ...forwardedProps
}: { className?: string } & PropsWithChildren) => (
  <div className={clsx(dialogWindow, className)} {...forwardedProps} />
)
