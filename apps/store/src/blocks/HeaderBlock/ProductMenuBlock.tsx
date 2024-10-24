'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import { sprinkles } from 'ui/src/theme/sprinkles.css'
import type { ButtonBlockProps } from '@/blocks/ButtonBlock'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlock/MenuItemBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import {
  navigationItem,
  navigationItemProductMenu,
  navigationMenuWrapper,
  navigationProductList,
} from '@/components/Header/Header.css'
import { NavigationContent } from '@/components/Header/NavigationContent'
import { ProductNavigationLink } from '@/components/Header/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/Header/NavigationTrigger/NavigationTrigger'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'

export type ProductMenuBlockProps = SbBaseBlockProps<{
  name: string
  menuItems: ExpectedBlockType<MenuItemBlockProps>
  buttons: ExpectedBlockType<ButtonBlockProps>
  currentActiveItem?: string
}> & { variant: 'mobile' | 'desktop' }
type ProductMenuItem = { name: string; url: string; image?: string; label?: string }
export const ProductMenuBlock = ({ blok, variant }: ProductMenuBlockProps) => {
  const locale = useRoutingLocale()
  const { t } = useTranslation()
  const productMetadata = useProductMetadata()
  const filteredMenuItems = filterByBlockType(blok.menuItems, MenuItemBlock.blockName)

  const productMenuItems: Array<ProductMenuItem> = []
  filteredMenuItems.forEach((item) => {
    const product = productMetadata?.find((product) => product.name === item.name)
    let menuItem
    if (product) {
      menuItem = {
        name: product.displayNameShort,
        url: product.pageLink,
        image: product.pillowImage.src,
        label: item.label,
      }
    } else {
      menuItem = {
        name: item.name,
        url: getLinkFieldURL(item.link, item.name),
        image: item.pillowImage?.filename,
        label: item.label,
      }
    }
    productMenuItems.push(menuItem)
  })

  const content = (
    <div className={clsx(navigationMenuWrapper, sprinkles({ paddingBottom: 'xl' }))}>
      <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
        <NavigationMenuPrimitive.List className={navigationProductList}>
          {productMenuItems.map((item) => (
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
    return <div className={sprinkles({ paddingTop: 'md' })}>{content}</div>
  } else {
    return (
      <NavigationMenuPrimitive.Item
        className={clsx(navigationItem, navigationItemProductMenu)}
        value={blok.name}
        {...storyblokEditable(blok)}
      >
        <NavigationTrigger>
          <ButtonNextLink size="medium" variant="secondary" href={PageLink.store({ locale })}>
            {blok.name}
          </ButtonNextLink>
        </NavigationTrigger>
        <NavigationContent>{content}</NavigationContent>
      </NavigationMenuPrimitive.Item>
    )
  }
}
ProductMenuBlock.blockName = 'productMenu'
