import Link from 'next/link'
import type { ButtonProps } from 'ui'
import { Button } from 'ui'

export type ButtonNextLinkProps = ButtonProps<typeof Link>

export const ButtonNextLink = ({ children, ...props }: ButtonNextLinkProps) => {
  return (
    <Button as={Link} {...props}>
      {children}
    </Button>
  )
}
