import Link from 'next/link'
import type { ButtonProps } from 'ui'
import { Button } from 'ui'

export const ButtonNextLink = ({ children, ...props }: ButtonProps<typeof Link>) => {
  return (
    <Button as={Link} {...props}>
      {children}
    </Button>
  )
}
