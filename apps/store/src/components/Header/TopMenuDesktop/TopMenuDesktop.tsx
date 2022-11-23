import React, { useState } from 'react'
import { Navigation } from '../HeaderStyles'
import { TopMenuDesktopProps } from './TopMenuDesktop.stories'

export const TopMenuDesktop = ({ children, currentActiveItem }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')

  return (
    <>
      <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
        {children}
      </Navigation>
    </>
  )
}
