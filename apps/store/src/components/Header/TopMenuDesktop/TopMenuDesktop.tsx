import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { navigation, navigationPrimaryList } from '../Header.css'

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
      <NavigationMenuPrimitive.List className={navigationPrimaryList}>
        {children}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}
