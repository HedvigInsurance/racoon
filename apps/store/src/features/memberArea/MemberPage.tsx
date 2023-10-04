import styled from '@emotion/styled'
import { t } from 'i18next'
import Head from 'next/head'
import Link from 'next/link'
import { Button, Heading, HedvigLogo, mq, theme } from 'ui'
import { LogoWrapper, LogoLink } from '@/components/Header/Header'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/apollo/generated'
import { resetAuthTokens } from '@/services/authApi/persist'
import { PageLink } from '@/utils/PageLink'
import { PaymentsSection } from './PaymentsSection'

export const MemberPage = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <Header>
        <LogoWrapper>
          <LogoLink href={PageLink.home()} aria-label={t('HOME_PAGE_LINK_LABEL')}>
            <HedvigLogo />
          </LogoLink>
        </LogoWrapper>
      </Header>
      <Main>
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

        <div>
          {loading && 'Loading...'}
          {data && <MemberInfo data={data} />}
        </div>
      </Main>
    </>
  )
}

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}
const MemberInfo = ({ data }: MemberInfoProps) => {
  const { currentMember } = data
  const greeting = `Hello, ${currentMember.firstName} ${currentMember.lastName}`
  return (
    <>
      <Heading as={'h2'} variant="standard.32">
        {greeting}
      </Heading>
      <PaymentsSection />
    </>
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
const Main = styled.main({
  width: '100%',
  display: 'grid',
  gridTemplateRows: '60px 1fr',

  [mq.lg]: {
    gridTemplateColumns: '200px 1fr',
    gridTemplateRows: 'auto',
  },
})

const Header = styled.header({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  top: 0,

  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,
  [mq.lg]: {
    height: MENU_BAR_HEIGHT_DESKTOP,
    paddingInline: theme.space.xl,
  },
})

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
