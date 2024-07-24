import { clsx } from 'clsx'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Text } from 'ui'
import { textLink } from './TextLink.css'

type TextLinkProps = ComponentProps<typeof Link> &
  Pick<ComponentProps<typeof Text>, 'as' | 'children' | 'color' | 'size'>

export function TextLink({
  as,
  className,
  color,
  children,
  href,
  size,
  target,
  ...forwardedProps
}: TextLinkProps) {
  return (
    <Link href={href} target={target} {...forwardedProps} className={clsx(textLink, className)}>
      <Text as={as} color={color} size={size}>
        {children}
      </Text>
    </Link>
  )
}
