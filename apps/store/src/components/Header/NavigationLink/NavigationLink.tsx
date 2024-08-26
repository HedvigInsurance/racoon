import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'
import Link from 'next/link'
import { Badge, Space, Text } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import {
  navigationLink,
  productNavigationLinkCard,
  expandingLink,
  secondaryNavigationLink,
} from './NavigationLink.css'

export type NavigationLinkProps = Pick<HTMLAnchorElement, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'> & {
    pillowImageSrc?: string
    label?: string
    absoluteUrl?: boolean
  }

export const NavigationLink = ({ href, className, children, ...rest }: NavigationLinkProps) => {
  // Render a regular <a> tag for manual URLs containing https://. Thats because when linking between locales (/no -> /se),
  // you end up on /no/se with using Next internal routing. This will also work for external links.
  const isExternalLink = /^(https?:)?\/\//.exec(href)
  if (isExternalLink) {
    return (
      <NavigationMenuPrimitive.Link
        href={href}
        className={clsx(navigationLink, className)}
        {...rest}
      >
        {children}
      </NavigationMenuPrimitive.Link>
    )
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <NavigationMenuPrimitive.Link className={clsx(navigationLink, className)} {...rest}>
        {children}
      </NavigationMenuPrimitive.Link>
    </Link>
  )
}

export const ProductNavigationLink = ({
  href,
  children,
  pillowImageSrc,
  label,
}: NavigationLinkProps) => {
  return (
    <Space className={productNavigationLinkCard}>
      <Pillow size="xsmall" src={pillowImageSrc} />
      <Link href={href} className={expandingLink}>
        <Text as="span" size={{ _: 'xl', lg: 'md' }}>
          {children}
        </Text>
      </Link>
      {label && (
        <Badge size="responsive" as="span" color="green50">
          {label}
        </Badge>
      )}
    </Space>
  )
}

export const SecondaryNavigationLink = ({
  href,
  className,
  children,
  ...rest
}: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <NavigationMenuPrimitive.Link className={clsx(secondaryNavigationLink, className)} {...rest}>
        {children}
      </NavigationMenuPrimitive.Link>
    </Link>
  )
}
