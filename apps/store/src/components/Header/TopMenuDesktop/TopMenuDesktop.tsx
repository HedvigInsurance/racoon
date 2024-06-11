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

export const TopMenuDesktop = ({ children, defaultValue }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState('')
  const pathname = usePathname()
  const variant = useResponsiveVariant('lg')

  useEffect(() => {
    setActiveItem('')
  }, [pathname])

  return (
    <>
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
