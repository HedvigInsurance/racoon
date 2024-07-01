'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { navigationPrimaryList, HeaderMenuDesktop } from '../Header.css'
import { HeaderMenuMobile } from '../HeaderMenuMobile/HeaderMenuMobile'

export type HeaderMenuDesktopProps = {
  children: ReactNode
  defaultValue?: string
}

export const HeaderMenu = ({ children, defaultValue }: HeaderMenuDesktopProps) => {
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
        className={HeaderMenuDesktop}
        value={activeItem}
        onValueChange={setActiveItem}
      >
        <NavigationMenuPrimitive.List className={navigationPrimaryList}>
          {children}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      {variant === 'mobile' && (
        <HeaderMenuMobile defaultValue={defaultValue}>{children}</HeaderMenuMobile>
      )}
    </>
  )
}
