import React, { useState } from 'react'
import { Navigation } from '../HeaderStyles'
import { NavigationPrimaryList } from '../HeaderStyles'

export type TopMenuDesktopProps = {
  currentActiveItem?: string
  navItems: (JSX.Element | null)[]
}

export const TopMenuDesktop = ({ navItems, currentActiveItem }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')

  return (
    <>
      <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
        <NavigationPrimaryList>{navItems}</NavigationPrimaryList>
      </Navigation>
    </>
  )
}
