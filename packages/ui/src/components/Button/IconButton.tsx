import clsx from 'clsx'
import { type ComponentProps, forwardRef } from 'react'
import { Button } from './Button'
import { iconButtonStyles } from './Button.css'

type ButtonProps = ComponentProps<typeof Button<'button'>>

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, forwardedRef) => (
    <Button
      className={clsx(iconButtonStyles, className)}
      variant="ghost"
      size="icon"
      Icon={children}
      {...props}
      ref={forwardedRef}
    />
  ),
)

IconButton.displayName = 'IconButton'
