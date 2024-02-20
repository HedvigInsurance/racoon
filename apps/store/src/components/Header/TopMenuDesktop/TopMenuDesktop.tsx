import styled from '@emotion/styled'
import React from 'react'
import { mq } from 'ui'
import { useOnPathnameChange } from '@/utils/useOnPathnameChange'
import { Navigation, NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  children: React.ReactNode
}

export const TopMenuDesktop = ({ children }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = React.useState('')
  useOnPathnameChange(() => setActiveItem(''))

  return (
    <Wrapper>
      <Navigation value={activeItem} onValueChange={setActiveItem}>
        <NavigationPrimaryList>{children}</NavigationPrimaryList>
      </Navigation>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'none',

  [mq.lg]: {
    display: 'block',
  },
})
