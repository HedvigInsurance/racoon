import styled from '@emotion/styled'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { mq } from 'ui'
import { Navigation, NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  children: React.ReactNode
}

export const TopMenuDesktop = ({ children }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = React.useState('')
  const pathname = usePathname()
  useEffect(() => {
    ;() => setActiveItem('')
  }, [pathname])

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
