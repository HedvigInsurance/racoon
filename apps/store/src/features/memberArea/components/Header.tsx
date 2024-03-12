import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { LogoWrapper } from '@/components/Header/Header'
import {
  MENU_BAR_HEIGHT_MOBILE,
  MENU_BAR_HEIGHT_DESKTOP,
} from '@/components/Header/Header.constants'
import { LogoHomeLink } from '@/components/LogoHomeLink'

export const Header = () => (
  <HeaderWrapper>
    <LogoWrapper>
      <LogoHomeLink />
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
