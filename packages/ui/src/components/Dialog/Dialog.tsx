import * as DialogPrimitive from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { forwardRef, startTransition, useCallback } from 'react'
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
          onInteractOutside={(e) => e.preventDefault()}
          // Prevents accessibility warning from radix
          // Adding non-visible descriptions everywhere is not a priority right now
          aria-describedby={undefined}
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

export const Root = ({
  onOpenChange,
  ...forwardedProps
}: ComponentProps<typeof DialogPrimitive.Root>) => {
  // Optimization: dialogs can get quite large, so it's good idea to treat opening/closing as transition
  const handleOpenChange = useCallback(
    (newValue: boolean) => {
      startTransition(() => {
        onOpenChange?.(newValue)
      })
    },
    [onOpenChange],
  )
  return <DialogPrimitive.Root {...forwardedProps} onOpenChange={handleOpenChange} />
}

export const Trigger = DialogPrimitive.Trigger
export const Title = DialogPrimitive.Title
export const Description = DialogPrimitive.Description
export const Close = DialogPrimitive.Close

// Example of exposing base component for further styling by either vanilla-extract or emotion
export const Window = ({
  className,
  ...forwardedProps
}: { className?: string } & PropsWithChildren) => (
  <div className={clsx(dialogWindow, className)} {...forwardedProps} />
)
