'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { type HeaderMenuProps } from '@/blocks/HeaderBlockNew/HeaderBlock'
import { NestedMenuBlock } from '@/blocks/HeaderBlockNew/NestedMenuBlock'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { navigationPrimaryList, HeaderMenuDesktop } from '../Header.css'
import { HeaderMenuMobile } from '../HeaderMenuMobile/HeaderMenuMobile'

export type HeaderMenuDesktopProps = {
  items: HeaderMenuProps
  defaultValue?: string
}

export const HeaderMenu = ({ items, defaultValue }: HeaderMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState('')
  const pathname = usePathname()
  const variant = useResponsiveVariant('lg')

  const content = useMemo(() => {
    // Optimization: we don't want to assume default variant to avoid rendering twice on miss
    if (variant === 'initial') return null
    return items.map((item) => <NestedMenuBlock key={item._uid} blok={item} variant={variant} />)
  }, [items, variant])

  useEffect(() => {
    setActiveItem('')
  }, [pathname])

  return (
    <>
      {/* 'Desktop' menu is always rendered for SEO reasons so navigation links becomes accessible */}
      {/* in the markup */}
      <NavigationMenuPrimitive.Root
        className={HeaderMenuDesktop}
        value={activeItem}
        onValueChange={setActiveItem}
      >
        <NavigationMenuPrimitive.List className={navigationPrimaryList}>
          {content}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      {variant === 'mobile' && (
        <HeaderMenuMobile defaultValue={defaultValue}>{content}</HeaderMenuMobile>
      )}
    </>
  )
}
