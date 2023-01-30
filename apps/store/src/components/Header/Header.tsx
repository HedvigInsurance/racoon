import styled from '@emotion/styled'
import Link from 'next/link'
import { HedvigLogo, mq } from 'ui'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { zIndexes } from '@/utils/zIndex'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from './HeaderStyles'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'

export const Wrapper = styled.header(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: MENU_BAR_HEIGHT_MOBILE,
  padding: ` 0 ${theme.space.md}`,
  position: 'sticky',
  zIndex: zIndexes.header,

  [mq.lg]: {
    flexDirection: 'row',
    height: MENU_BAR_HEIGHT_DESKTOP,
    backgroundColor: theme.colors.light,
    top: 0,
  },
}))

const LogoWrapper = styled(Link)({
  flex: 1,
})

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: 1,
  [mq.lg]: {
    justifyContent: 'space-between',
  },
})

type HeaderProps = {
  children: React.ReactNode
}
export const Header = ({ children }: HeaderProps) => {
  const { routingLocale } = useCurrentLocale()

  return (
    <Wrapper>
      <LogoWrapper href={PageLink.home({ locale: routingLocale })}>
        <HedvigLogo />
      </LogoWrapper>
      <ContentWrapper>
        {children}
        <ShoppingCartMenuItem />
      </ContentWrapper>
    </Wrapper>
  )
}
