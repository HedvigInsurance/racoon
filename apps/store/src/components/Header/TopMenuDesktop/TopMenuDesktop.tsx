import React from 'react'
import { Navigation } from '../HeaderStyles'
import { NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  children: React.ReactNode
}

export const TopMenuDesktop = ({ children }: TopMenuDesktopProps) => {
  return (
    <>
      <Navigation>
        <NavigationPrimaryList>{children}</NavigationPrimaryList>
      </Navigation>
    </>
  )
}
