import Link from 'next/link'
import { Button, ButtonProps } from 'ui'

export const ButtonNextLink = ({ children, ...props }: ButtonProps) => {
  return (
    <Button as={Link} passHref={true} legacyBehavior={true} {...props}>
      {children}
    </Button>
  )
}
