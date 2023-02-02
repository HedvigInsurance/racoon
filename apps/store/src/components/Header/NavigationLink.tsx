import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import { mq, Space, Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { focusableStyles } from './HeaderStyles'

const StyledSecondaryNavigationLink = styled(NavigationMenuPrimitive.Link)({
  alignSelf: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  ...focusableStyles,
})

const ProductNavigationLinkCard = styled(Space)({
  ...focusableStyles,
  display: 'flex',
  placeItems: 'center',
  flexDirection: 'column',
  flexShrink: 0,

  [mq.lg]: {
    padding: `${theme.space.md} ${theme.space.lg}`,
    borderRadius: theme.radius.sm,
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.grayTranslucent100,
      },
    },
  },
})

const StyledPillow = styled(Pillow)({
  height: '6rem',
  width: '6rem',
  [mq.lg]: {
    height: '4rem',
    width: '4rem',
  },
})

type NavigationLinkProps = Pick<LinkProps, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'> & {
    pillowImageSrc?: string
  }

export const NavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
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

export const ProductNavigationLink = ({ href, children, pillowImageSrc }: NavigationLinkProps) => {
  return (
    <Link href={href}>
      <ProductNavigationLinkCard y={0.75}>
        <StyledPillow size="large" src={pillowImageSrc} />
        <Text>{children}</Text>
      </ProductNavigationLinkCard>
    </Link>
  )
}

export const SecondaryNavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <StyledSecondaryNavigationLink {...rest}>{children}</StyledSecondaryNavigationLink>
    </Link>
  )
}
