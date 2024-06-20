'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import type { ButtonBlockProps } from '@/blocks/ButtonBlock'
import { NavItemBlock, type NavItemBlockProps } from '@/blocks/HeaderBlock/NavItemBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import {
  navigationItem,
  navigationMenuWrapper,
  navigationProductList,
} from '@/components/Header/Header.css'
import { NavigationContent } from '@/components/Header/NavigationContent'
import { ProductNavigationLink } from '@/components/Header/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/Header/NavigationTrigger'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { mobileWrapper } from './ProductNavContainerBlock.css'

export type ProductNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
  buttons: ExpectedBlockType<ButtonBlockProps>
  currentActiveItem?: string
}> & { variant: 'mobile' | 'desktop' }
type ProductNavItem = { name: string; url: string; image?: string; label?: string }
export const ProductNavContainerBlock = ({ blok, variant }: ProductNavContainerBlockProps) => {
  const locale = useRoutingLocale()
  const { t } = useTranslation()
  const productMetadata = useProductMetadata()
  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)

  const productNavItems: Array<ProductNavItem> = []
  filteredNavItems.forEach((item) => {
    const product = productMetadata?.find((product) => product.name === item.name)
    let navItem
    if (product) {
      navItem = {
        name: product.displayNameShort,
        url: product.pageLink,
        image: product.pillowImage.src,
        label: item.label,
      }
    } else {
      navItem = {
        name: item.name,
        url: getLinkFieldURL(item.link, item.name),
        image: item.pillowImage?.filename,
        label: item.label,
      }
    }
    productNavItems.push(navItem)
  })

  const content = (
    <div className={navigationMenuWrapper}>
      <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
        <NavigationMenuPrimitive.List className={navigationProductList}>
          {productNavItems.map((item) => (
            <NavigationMenuPrimitive.Item key={item.name} value={item.name}>
              <ProductNavigationLink href={item.url} pillowImageSrc={item.image} label={item.label}>
                {item.name}
              </ProductNavigationLink>
            </NavigationMenuPrimitive.Item>
          ))}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Sub>
      <ButtonNextLink
        href={PageLink.store({ locale })}
        variant="secondary"
        size="medium"
        fullWidth={true}
      >
        {t('NAVIGATION_STORE_LINK')}
      </ButtonNextLink>
    </div>
  )

  if (variant === 'mobile') {
    return <div className={mobileWrapper}>{content}</div>
  } else {
    return (
      <NavigationMenuPrimitive.Item
        className={navigationItem}
        value={blok.name}
        {...storyblokEditable(blok)}
      >
        <NavigationTrigger href={PageLink.store({ locale })}>{blok.name}</NavigationTrigger>
        <NavigationContent>{content}</NavigationContent>
      </NavigationMenuPrimitive.Item>
    )
  }
}
ProductNavContainerBlock.blockName = 'productNavContainer'
