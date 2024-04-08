import Link from 'next/link'
import { Button, ButtonProps } from 'ui'

export const ButtonNextLink = ({ children, ...props }: ButtonProps<typeof Link>) => {
  return (
    <Button as={Link} {...props}>
      {children}
    </Button>
  )
}
