import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link from 'next/link'
import { Badge, mq, Space, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { focusableStyles } from './HeaderStyles'

const StyledSecondaryNavigationLink = styled(NavigationMenuPrimitive.Link)({
  alignSelf: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  ...focusableStyles,
})

type NavigationLinkProps = Pick<HTMLAnchorElement, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'> & {
    pillowImageSrc?: string
    label?: string
    absoluteUrl?: boolean
  }

export const NavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  // Render a regular <a> tag for manual URLs containing https://. Thats because when linking between locales (/no -> /se),
  // you end up on /no/se with using Next internal routing. This will also work for external links.
  const isExternalLink = href.match(/^(https?:)?\/\//)
  if (isExternalLink) {
    return (
      <StyledNavigationLink href={href} {...rest}>
        {children}
      </StyledNavigationLink>
    )
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <StyledNavigationLink {...rest}>{children}</StyledNavigationLink>
    </Link>
  )
}

const StyledNavigationLink = styled(NavigationMenuPrimitive.Link)({
  ...focusableStyles,
  display: 'block',
  paddingBlock: theme.space.lg,

  [mq.lg]: {
    paddingBlock: theme.space.xs,
    paddingInline: theme.space.md,

    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
})

export const ProductNavigationLink = ({
  href,
  children,
  pillowImageSrc,
  label,
}: NavigationLinkProps) => {
  return (
    <ProductNavigationLinkCard>
      <Pillow size="xsmall" src={pillowImageSrc} />
      <ExpandingLink href={href}>
        <Text as="span" size={{ _: 'xl', lg: 'md' }}>
          {children}
        </Text>
      </ExpandingLink>
      {label && (
        <Badge size={{ _: 'big', lg: 'small' }} as="span" color="green50">
          {label}
        </Badge>
      )}
    </ProductNavigationLinkCard>
  )
}

const ProductNavigationLinkCard = styled(Space)({
  ...focusableStyles,
  display: 'flex',
  columnGap: theme.space.sm,
  placeItems: 'center',
  flexShrink: 0,
  paddingBlock: theme.space.xs,
  position: 'relative',

  [mq.lg]: {
    columnGap: theme.space.xs,
    paddingInline: theme.space.xs,
    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
})

const ExpandingLink = styled(Link)({
  // Make the whole card clickable - CallToAction height
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
})

export const SecondaryNavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <StyledSecondaryNavigationLink {...rest}>{children}</StyledSecondaryNavigationLink>
    </Link>
  )
}
