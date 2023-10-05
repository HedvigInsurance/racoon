import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { theme, mq, Button } from 'ui'
import { resetAuthTokens } from '@/services/authApi/persist'

export const Menu = () => {
  const router = useRouter()
  const currentRoute = router.pathname
  return (
    <Navigation>
      <NavigationList>
        <NavgationItem>
          <NavigationLink
            href={'/member/insurances'}
            data-active={currentRoute === '/member/insurances'}
          >
            Insurances
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={'/member/payments'}
            data-active={currentRoute === '/member/payments'}
          >
            Payments
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink href={'/member/claim'}>Make a claim</NavigationLink>
        </NavgationItem>
        <LogoutButton />
      </NavigationList>
    </Navigation>
  )
}

const LogoutButton = () => {
  // Perhaps we should have /api/logout route in the future. Using native href would be nice
  const handleLogout = () => {
    resetAuthTokens()
    window.location.reload()
  }

  return (
    <Button size="medium" variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  )
}

const Navigation = styled.nav({
  paddingInline: theme.space.md,
  paddingBottom: theme.space.sm,
  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const NavigationList = styled.ul({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  height: '100%',
  gap: theme.space.md,
  [mq.lg]: {
    flexDirection: 'column',
    gap: theme.space.md,
  },
})

const NavgationItem = styled.li({
  display: 'flex',
  width: '100%',
})

const NavigationLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '3.25rem',
  padding: theme.space.sm,
  borderRadius: theme.radius.sm,

  '&[data-active="true"]': {
    backgroundColor: theme.colors.grayTranslucent100,
  },

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.grayTranslucent100,
    },
  },
})
