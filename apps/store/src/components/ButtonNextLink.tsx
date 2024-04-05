import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Button } from 'ui'

type Props = ComponentProps<typeof Button>

export const ButtonNextLink = ({ children, ...props }: Props) => {
  return (
    <Button as={Link} passHref={true} legacyBehavior={true} {...props}>
      {children}
    </Button>
  )
}
