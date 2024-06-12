import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { navigationPrimaryList, topMenuDesktop } from '../Header.css'
import { TopMenuMobile } from '../TopMenuMobile/TopMenuMobile'

export type TopMenuDesktopProps = {
  children: ReactNode
  defaultValue?: string
}

export const TopMenu = ({ children, defaultValue }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState('')
  const pathname = usePathname()
  const variant = useResponsiveVariant('lg')

  useEffect(() => {
    setActiveItem('')
  }, [pathname])

  return (
    <>
      {/* 'Desktop' menu is always rendered for SEO reasons so navigation links becomes acessible */}
      {/* in the markup */}
      <NavigationMenuPrimitive.Root
        className={topMenuDesktop}
        value={activeItem}
        onValueChange={setActiveItem}
      >
        <NavigationMenuPrimitive.List className={navigationPrimaryList}>
          {children}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      {variant === 'mobile' && (
        <TopMenuMobile defaultValue={defaultValue}>{children}</TopMenuMobile>
      )}
    </>
  )
}
