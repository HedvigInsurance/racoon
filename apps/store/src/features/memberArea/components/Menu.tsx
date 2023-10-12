import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { theme, mq, Button } from 'ui'
import { resetAuthTokens } from '@/services/authApi/persist'

export const Menu = () => {
  const router = useRouter()
  const { t } = useTranslation('memberArea')
  const currentRoute = router.pathname
  return (
    <Navigation>
      <NavigationList>
        <NavgationItem>
          <NavigationLink
            href={'/member/insurances'}
            data-active={currentRoute.includes('/member/insurances')}
          >
            {t('MENU_ITEM_LABEL_INSURANCE')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={'/member/payments'}
            data-active={currentRoute === '/member/payments'}
          >
            {t('MENU_ITEM_LABEL_PAYMENT')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink href={'/member/claim'} data-active={currentRoute === '/member/claim'}>
            {t('MENU_ITEM_LABEL_CLAIM')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink href={'/help/faq'}>FAQ</NavigationLink>
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
  overflow: 'auto',
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
  [mq.lg]: {
    width: '100%',
  },
})

const NavigationLink = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  height: '2.5rem',
  padding: theme.space.sm,
  borderRadius: theme.radius.sm,
  whiteSpace: 'nowrap',
  fontSize: theme.fontSizes.md,

  [mq.lg]: {
    width: '100%',
    height: '3.25rem',
  },

  '&[data-active="true"]': {
    backgroundColor: theme.colors.blueFill1,
  },

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.grayTranslucent100,
    },
  },
})
