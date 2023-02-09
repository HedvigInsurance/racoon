import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { mq } from 'ui'
import { Navigation } from '../HeaderStyles'
import { NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  children: React.ReactNode
}

export const TopMenuDesktop = ({ children }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = React.useState('')
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => setActiveItem('')
    router.events.on('routeChangeStart', handleRouteChange)
    return () => router.events.off('routeChangeStart', handleRouteChange)
  }, [router.events])

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
