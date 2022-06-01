import styled from '@emotion/styled'
import React from 'react'
import { HedvigLogo, mq } from 'ui'
import { LanguageSwitcher } from '../language-switcher'

const HeaderContainer = styled.div((props) => ({
  padding: '22.5px 0',
  paddingLeft: '2rem',
  paddingRight: '1.75rem',
  height: '4.5rem',
  position: 'sticky',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: props.theme.colors.white,
  top: 0,
  zIndex: 100,
  [mq.sm]: {
    height: '5rem',
  },
}))

const HeaderMenu = styled.div({
  marginLeft: 'auto',
})

export const Header = () => {
  return (
    <HeaderContainer>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/">
        <HedvigLogo />
      </a>
      <HeaderMenu>
        <LanguageSwitcher />
      </HeaderMenu>
    </HeaderContainer>
  )
}
