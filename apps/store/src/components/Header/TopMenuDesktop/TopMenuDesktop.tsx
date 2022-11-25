import React, { useState } from 'react'
import { Navigation } from '../HeaderStyles'
import { NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  currentActiveItem?: string
  children: React.ReactNode
}

export const TopMenuDesktop = ({ children, currentActiveItem }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')

  return (
    <>
      <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
        <NavigationPrimaryList>{children}</NavigationPrimaryList>
      </Navigation>
    </>
  )
}
