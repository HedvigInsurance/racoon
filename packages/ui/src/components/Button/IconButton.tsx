import { type ComponentProps, forwardRef } from 'react'
import { Button } from './Button'

type ButtonProps = Omit<ComponentProps<typeof Button<'button'>>, 'size'>

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => (
  <Button
    variant="ghost"
    size="small"
    style={{ padding: '0', aspectRatio: '1', height: 'auto' }}
    {...props}
    isIconButton
    ref={forwardedRef}
  />
))

IconButton.displayName = 'IconButton'
