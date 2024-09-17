import { type ComponentProps, forwardRef } from 'react'
import { Button } from './Button'

type ButtonProps = ComponentProps<typeof Button<'button'>>

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, forwardedRef) => (
    <Button
      variant="ghost"
      size="icon"
      style={{ aspectRatio: '1', height: 'auto' }}
      Icon={children}
      {...props}
      ref={forwardedRef}
    />
  ),
)

IconButton.displayName = 'IconButton'
