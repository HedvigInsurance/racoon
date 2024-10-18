import Link from 'next/link'
import { forwardRef } from 'react'
import { Button, type ButtonProps } from 'ui/src/components/Button/Button'

export type ButtonNextLinkProps = ButtonProps<typeof Link>

export const ButtonNextLink = forwardRef<HTMLAnchorElement, ButtonNextLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button as={Link} {...props} ref={ref}>
        {children}
      </Button>
    )
  },
)
ButtonNextLink.displayName = 'ButtonNextLink'
