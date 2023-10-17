import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { theme, mq, Button } from 'ui'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'

export const Menu = () => {
  const router = useRouter()
  const { t } = useTranslation('memberArea')
  const { routingLocale } = useCurrentLocale()
  const currentRoute = router.pathname

  const internalItems = {
    claim: PageLink.memberAreaClaim(),
    insurances: PageLink.memberAreaInsurances(),
    payments: PageLink.memberAreaPayments(),
  }

  return (
    <Navigation>
      <NavigationList>
        <NavgationItem>
          <NavigationLink
            href={internalItems.insurances}
            data-active={router.pathname === internalItems.insurances.pathname}
          >
            {t('MENU_ITEM_LABEL_INSURANCE')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={internalItems.payments}
            data-active={currentRoute.includes(internalItems.payments.pathname)}
          >
            {t('MENU_ITEM_LABEL_PAYMENT')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={internalItems.claim}
            data-active={currentRoute.includes(internalItems.claim.pathname)}
          >
            {t('MENU_ITEM_LABEL_CLAIM')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink href={PageLink.faq({ locale: routingLocale })}>FAQ</NavigationLink>
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
  overflowX: 'auto',

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const NavigationList = styled.ul({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.space.xs,
  width: 'fit-content',

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

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.grayTranslucent100,
    },
  },

  '&[data-active="true"]': {
    backgroundColor: theme.colors.blueFill1,

    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: theme.colors.blueFill1,
      },
    },
  },
})
