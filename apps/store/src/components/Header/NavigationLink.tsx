import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import { Space } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { focusableStyles } from './HeaderStyles'

const StyledNavigationLink = styled(NavigationMenuPrimitive.Link)({
  textDecoration: 'none',
  ...focusableStyles,
})

const SecondaryNavigationLinkCard = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const StyledPillow = styled(Pillow)(({ theme }) => ({
  marginRight: theme.space[3],
}))

type NavigationLinkProps = Pick<LinkProps, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'>

export const NavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledNavigationLink {...rest}>{children}</StyledNavigationLink>
    </Link>
  )
}

export const SecondaryNavigationLink = ({ href, children, ...rest }: NavigationLinkProps) => {
  return (
    <>
      <SecondaryNavigationLinkCard>
        <StyledPillow size="xsmall" fromColor="dodgerblue" toColor="palevioletred" />
        <Link href={href} passHref>
          <StyledNavigationLink {...rest}>{children}</StyledNavigationLink>
        </Link>
      </SecondaryNavigationLinkCard>
    </>
  )
}
