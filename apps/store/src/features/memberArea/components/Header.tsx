import styled from '@emotion/styled'
import { t } from 'i18next'
import { HedvigLogo, mq, theme } from 'ui'
import { LogoLink, LogoWrapper } from '@/components/Header/Header'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { PageLink } from '@/utils/PageLink'

export const Header = () => (
  <HeaderWrapper>
    <LogoWrapper>
      <LogoLink href={PageLink.home()} aria-label={t('HOME_PAGE_LINK_LABEL')}>
        <HedvigLogo />
      </LogoLink>
    </LogoWrapper>
  </HeaderWrapper>
)

const HeaderWrapper = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '80rem',
  width: '100%',
  marginInline: 'auto',

  height: MENU_BAR_HEIGHT_MOBILE,
  paddingInline: theme.space.md,
  [mq.lg]: {
    height: MENU_BAR_HEIGHT_DESKTOP,
    paddingInline: theme.space.xl,
  },
})
