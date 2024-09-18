import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { logoWrapper, MENU_BAR_HEIGHT_DESKTOP } from '@/components/HeaderNew/Header.css'
import { MENU_BAR_HEIGHT_MOBILE } from '@/components/HeaderNew/HeaderMenuMobile/HeaderMenuMobile.css'
import { LogoHomeLink } from '@/components/LogoHomeLink'

export const Header = () => (
  <HeaderWrapper>
    <div className={logoWrapper}>
      <LogoHomeLink />
    </div>
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
