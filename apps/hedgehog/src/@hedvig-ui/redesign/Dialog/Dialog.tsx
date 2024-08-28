import * as DialogPrimitive from '@radix-ui/react-dialog'
import clsx from 'clsx'

import { overlay, content } from './Dialog.css'
import { ComponentPropsWithRef, forwardRef } from 'react'

type Props = ComponentPropsWithRef<typeof DialogPrimitive.Content>

const DialogContent = forwardRef(
  ({ children, className, ...props }: Props, ref: Props['ref']) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlay}>
          <DialogPrimitive.Content
            className={clsx(content, className)}
            {...props}
            ref={ref}
          >
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    )
  },
)

export const Dialog = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Close: DialogPrimitive.DialogClose,
  Content: DialogContent,
  Title: DialogPrimitive.Title,
  Description: DialogPrimitive.Description,
}
