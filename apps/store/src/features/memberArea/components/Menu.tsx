import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { theme, mq, Text } from 'ui'
import { Skeleton } from '@/components/Skeleton'
import { resetAuthTokens } from '@/services/authApi/persist'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'
import { useMemberAreaInfo } from '../useMemberAreaInfo'

export const Menu = () => {
  const router = useRouter()
  const { firstName, lastName, ssn } = useMemberAreaInfo()
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('memberArea')
  const formatter = useFormatter()

  const currentRoute = router.pathname
  const memberName = `${firstName} ${lastName}`

  const internalItems = {
    claim: PageLink.memberAreaClaim().pathname,
    insurances: PageLink.memberAreaInsurances().pathname,
    payments: PageLink.memberAreaPayments().pathname,
  }

  return (
    <Navigation>
      <MemberInfo>
        <Text>{memberName}</Text>
        {ssn && <Text color="textSecondary">{formatter.ssn(ssn)}</Text>}
      </MemberInfo>
      <NavigationList>
        <NavgationItem>
          <NavigationLink
            href={internalItems.insurances}
            data-active={router.pathname === internalItems.insurances}
          >
            {t('MENU_ITEM_LABEL_INSURANCE')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={internalItems.payments}
            data-active={currentRoute.includes(internalItems.payments)}
          >
            {t('MENU_ITEM_LABEL_PAYMENT')}
          </NavigationLink>
        </NavgationItem>
        <NavgationItem>
          <NavigationLink
            href={internalItems.claim}
            data-active={currentRoute.includes(internalItems.claim)}
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

  return <NavigationButton onClick={handleLogout}>Logout</NavigationButton>
}

const Navigation = styled.nav({
  paddingInline: theme.space.md,
  paddingBottom: theme.space.sm,
  overflowX: 'auto',

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
})

const MemberInfo = styled.div({
  display: 'none',
  [mq.lg]: {
    display: 'block',
    width: '100%',
    marginBottom: theme.space.lg,
    lineHeight: 1.33,
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
    width: '100%',
  },
})

const NavgationItem = styled.li({
  display: 'flex',

  [mq.lg]: {
    width: '100%',
  },
})

const NavigationItemStyles = css({
  display: 'flex',
  alignItems: 'center',
  height: '2.5rem',
  padding: theme.space.sm,
  borderRadius: theme.radius.sm,
  whiteSpace: 'nowrap',
  fontSize: theme.fontSizes.md,

  [mq.lg]: {
    width: '100%',
    height: '3rem',
  },

  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: theme.colors.grayTranslucent100,
    },
  },

  '&[data-active="true"]': {
    backgroundColor: theme.colors.grayTranslucent100,
  },
})

const NavigationButton = styled.button(NavigationItemStyles, {
  color: theme.colors.signalRedElement,
  cursor: 'pointer',
})

const NavigationLink = styled(Link)(NavigationItemStyles)

export const MenuLoadingState = () => {
  return (
    <Navigation>
      <NavigationList>
        <NavItemSkeleton />
        <NavItemSkeleton />
        <NavItemSkeleton />
        <NavItemSkeleton />
        <NavItemSkeleton />
        <NavItemSkeleton />
      </NavigationList>
    </Navigation>
  )
}

const NavItemSkeleton = styled(Skeleton)({
  width: '165px',
  height: '2.5rem',
  '&:nth-child(even)': { width: '98px' },

  [mq.lg]: {
    '&&': { width: '100%' },
    height: '3rem',
  },
})