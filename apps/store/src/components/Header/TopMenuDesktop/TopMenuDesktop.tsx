import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { navigation } from '../Header.css'
import { NavigationPrimaryList } from '../HeaderStyles'

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
    <NavigationMenuPrimitive.Root
      className={navigation}
      value={activeItem}
      onValueChange={setActiveItem}
    >
      <NavigationPrimaryList>{children}</NavigationPrimaryList>
    </NavigationMenuPrimitive.Root>
  )
}
