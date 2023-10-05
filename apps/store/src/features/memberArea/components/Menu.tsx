import styled from '@emotion/styled'
import Link from 'next/link'
import { theme, mq, Button } from 'ui'
import { resetAuthTokens } from '@/services/authApi/persist'

export const Menu = () => {
  return (
    <Navigation>
      <NavigationList>
        <li>
          <Link href={'/member'}>Insurances</Link>
        </li>
        <li>
          <Link href={'/member/profile'}>Profile</Link>
        </li>
        <li>
          <Link href={'/member/claim'}>Make a claim</Link>
        </li>
        <li>
          <LogoutButton />
        </li>
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
    <Button size="small" variant="secondary" onClick={handleLogout}>
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
    gap: theme.space.xl,
  },
})
