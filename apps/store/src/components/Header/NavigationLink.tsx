import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import { mq, Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { focusableStyles } from './HeaderStyles'

const StyledNavigationLink = styled(NavigationMenuPrimitive.Link)({
  textDecoration: 'none',
  ...focusableStyles,
})

const StyledSecondaryNavigationLink = styled(NavigationMenuPrimitive.Link)(({ theme }) => ({
  textDecoration: 'none',
  marginLeft: theme.space[4],
  ...focusableStyles,
}))

const ProductNavigationLinkCard = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
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
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'>

export const NavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <StyledNavigationLink {...rest}>{children}</StyledNavigationLink>
    </Link>
  )
}

export const ProductNavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <>
      <ProductNavigationLinkCard y={0.75}>
        <StyledPillow size="large" />
        <Link href={href} passHref legacyBehavior>
          <StyledNavigationLink {...rest}>{children}</StyledNavigationLink>
        </Link>
      </ProductNavigationLinkCard>
    </>
  )
}

export const SecondaryNavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <StyledSecondaryNavigationLink {...rest}>{children}</StyledSecondaryNavigationLink>
    </Link>
  )
}
