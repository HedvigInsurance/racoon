import { forwardRef } from 'react'
import {
  Button,
  type Props as ButtonProps,
} from '@hedvig-ui/redesign/Button/Button'

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, forwardedRef) => (
    <Button
      variant="ghost"
      style={{ padding: '0', aspectRatio: '1' }}
      {...props}
      ref={forwardedRef}
    />
  ),
)
