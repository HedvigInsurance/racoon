'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { CrossIcon, Text, xStack } from 'ui'
import { type HeaderMenuProps } from '@/blocks/HeaderBlock/HeaderBlock'
import { NestedMenuBlock } from '@/blocks/HeaderBlock/NestedMenuBlock'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import { navigationPrimaryList, HeaderMenuDesktop } from '../Header.css'
import { HeaderMenuMobile } from '../HeaderMenuMobile/HeaderMenuMobile'
import {
  backButtonText,
  backWrapper,
  displayMobileMenu,
  displaySubmenus,
  headerMenu,
  headerMenuMobile,
} from './HeaderMenu.css'

export type HeaderMenuDesktopProps = {
  items: HeaderMenuProps
  defaultValue?: string
}

export const HeaderMenu = ({ defaultValue, items }: HeaderMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState('')
  const pathname = usePathname()
  const variant = useResponsiveVariant('lg')
  const productMetadata = useProductMetadata()

  const product = productMetadata?.find((product) => pathname === product.priceCalculatorPageLink)

  const content = useMemo(() => {
    // Optimization: we don't want to assume default variant to avoid rendering twice on miss
    if (variant === 'initial') return null
    return items.map((item) => <NestedMenuBlock key={item._uid} blok={item} variant={variant} />)
  }, [items, variant])

  const priceCalculatorMenu = useMemo(() => {
    // Optimization: we don't want to assume default variant to avoid rendering twice on miss
    if (variant === 'initial') return null
    return (
      <>
        {product && (
          <Link href={product.pageLink} className={xStack({ gap: 'md', alignItems: 'center' })}>
            <div className={backWrapper}>
              <CrossIcon size="1.5rem" />
            </div>
            <Text className={backButtonText}>{product.displayNameFull}</Text>
          </Link>
        )}
      </>
    )
  }, [product, variant])

  useEffect(() => {
    setActiveItem('')
  }, [pathname])

  return (
    <div
      className={headerMenu}
      style={assignInlineVars({
        [displaySubmenus]: product ? 'none' : 'block',
      })}
    >
      {/* 'Desktop' menu is always rendered for SEO reasons so navigation links becomes accessible */}
      {/* in the markup */}
      <NavigationMenuPrimitive.Root
        className={HeaderMenuDesktop}
        value={activeItem}
        onValueChange={setActiveItem}
      >
        <NavigationMenuPrimitive.List className={navigationPrimaryList}>
          {priceCalculatorMenu}
          {content}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>

      {variant === 'mobile' && (
        <>
          {priceCalculatorMenu}
          <div
            className={headerMenuMobile}
            style={assignInlineVars({
              [displayMobileMenu]: product ? 'none' : 'flex',
            })}
          >
            <HeaderMenuMobile defaultValue={defaultValue}>{content}</HeaderMenuMobile>
          </div>
        </>
      )}
    </div>
  )
}
