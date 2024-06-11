'use client'
import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'
import { Space, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Header } from '@/components/Header/Header'
import {
  navigationContent,
  navigationItem,
  navigationMenuWrapper,
  navigationProductList,
  navigationSecondaryItem,
  navigationSecondaryList,
} from '@/components/Header/Header.css'
import {
  NavigationLink,
  ProductNavigationLink,
  SecondaryNavigationLink,
} from '@/components/Header/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/Header/NavigationTrigger'
import { ShoppingCartMenuItem } from '@/components/Header/ShoppingCartMenuItem'
import { TopMenuDesktop } from '@/components/Header/TopMenuDesktop/TopMenuDesktop'
import { TopMenuMobile } from '@/components/Header/TopMenuMobile/TopMenuMobile'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import type {
  ExpectedBlockType,
  LinkField,
  SbBaseBlockProps,
  StoryblokAsset,
} from '@/services/storyblok/storyblok'
import {
  checkBlockType,
  filterByBlockType,
  getLinkFieldURL,
} from '@/services/storyblok/Storyblok.helpers'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'
import type { ButtonBlockProps } from './ButtonBlock'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
  pillowImage?: StoryblokAsset
  label?: string
}>

export const NavItemBlock = ({ blok }: NavItemBlockProps) => {
  return (
    <NavigationMenuPrimitive.Item
      className={navigationItem}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      <NavigationLink href={getLinkFieldURL(blok.link, blok.name)}>{blok.name}</NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}
NavItemBlock.blockName = 'navItem'

type NestedNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
  currentActiveItem?: string
}>

export const NestedNavContainerBlock = ({ blok }: NestedNavContainerBlockProps) => {
  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)

  if (filteredNavItems.length === 0) {
    return null
  }

  const firstNavItem = filteredNavItems[0]

  return (
    <NavigationMenuPrimitive.Item
      className={navigationItem}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      <NavigationTrigger href={getLinkFieldURL(firstNavItem.link, firstNavItem.name)}>
        {blok.name}
      </NavigationTrigger>
      <NavigationMenuPrimitive.Content className={navigationContent}>
        <div className={navigationMenuWrapper}>
          <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
            <NavigationMenuPrimitive.List className={navigationSecondaryList}>
              {filteredNavItems.map((nestedBlock) => (
                <SecondaryNavigationLink
                  key={nestedBlock._uid}
                  href={getLinkFieldURL(nestedBlock.link, nestedBlock.name)}
                >
                  <NavigationMenuPrimitive.Item
                    className={navigationSecondaryItem}
                    value={nestedBlock.name}
                    {...storyblokEditable(nestedBlock)}
                  >
                    {nestedBlock.name}
                  </NavigationMenuPrimitive.Item>
                </SecondaryNavigationLink>
              ))}
            </NavigationMenuPrimitive.List>
          </NavigationMenuPrimitive.Sub>
        </div>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

type ProductNavContainerBlockProps = SbBaseBlockProps<{
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
      <Space y={{ base: 1.5, lg: 1 }}>
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <NavigationMenuPrimitive.List className={navigationProductList}>
            {productNavItems.map((item) => (
              <NavigationMenuPrimitive.Item key={item.name} value={item.name}>
                <ProductNavigationLink
                  href={item.url}
                  pillowImageSrc={item.image}
                  label={item.label}
                >
                  {item.name}
                </ProductNavigationLink>
              </NavigationMenuPrimitive.Item>
            ))}
          </NavigationMenuPrimitive.List>
        </NavigationMenuPrimitive.Sub>
        <ButtonNextLinkFullWidth
          href={PageLink.store({ locale })}
          variant="secondary"
          size="medium"
        >
          {t('NAVIGATION_STORE_LINK')}
        </ButtonNextLinkFullWidth>
      </Space>
    </div>
  )

  if (variant === 'mobile') {
    return <MobileWrapper>{content}</MobileWrapper>
  } else {
    return (
      <NavigationMenuPrimitive.Item
        className={navigationItem}
        value={blok.name}
        {...storyblokEditable(blok)}
      >
        <NavigationTrigger href={PageLink.store({ locale })}>{blok.name}</NavigationTrigger>
        <NavigationMenuPrimitive.Content className={navigationContent}>
          {content}
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>
    )
  }
}
ProductNavContainerBlock.blockName = 'productNavContainer'

const MobileWrapper = styled.div({
  paddingTop: theme.space.md,
  borderBottom: `1px solid ${theme.colors.borderOpaque1}`,
})

const ButtonNextLinkFullWidth = styled(ButtonNextLink)({ width: '100%' })

type NestedNavigationBlockProps = {
  blok: HeaderBlockProps['blok']['navMenuContainer'][number]
  variant: 'mobile' | 'desktop'
}

const NestedNavigationBlock = ({ blok, variant }: NestedNavigationBlockProps) => {
  const navContainer = checkBlockType<NestedNavContainerBlockProps['blok']>(
    blok,
    NestedNavContainerBlock.blockName,
  )
  if (navContainer) {
    return <NestedNavContainerBlock key={navContainer._uid} blok={navContainer} />
  }

  const productNavContainer = checkBlockType<ProductNavContainerBlockProps['blok']>(
    blok,
    ProductNavContainerBlock.blockName,
  )
  if (productNavContainer) {
    return (
      <ProductNavContainerBlock
        key={productNavContainer._uid}
        blok={productNavContainer}
        variant={variant}
      />
    )
  }

  const navBlock = checkBlockType<NavItemBlockProps['blok']>(blok, NavItemBlock.blockName)
  if (navBlock) return <NavItemBlock key={navBlock._uid} blok={navBlock} />

  return null
}

export type HeaderBlockProps = SbBaseBlockProps<{
  navMenuContainer: ExpectedBlockType<
    NestedNavContainerBlockProps | NavItemBlockProps | ProductNavContainerBlockProps
  >
}>

// Performance considerations
// - this block is important for site-wide INP since it's present on most pages and is used often
export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
  const variant = useResponsiveVariant('lg')

  const productNavItem = useMemo(
    () =>
      blok.navMenuContainer.find((item) =>
        checkBlockType<ProductNavContainerBlockProps['blok']>(
          item,
          ProductNavContainerBlock.blockName,
        ),
      )?.name,
    [blok.navMenuContainer],
  )
  return (
    <Header {...storyblokEditable(blok)}>
      {variant === 'desktop' && (
        <TopMenuDesktop>
          {blok.navMenuContainer.map((item) => (
            <NestedNavigationBlock key={item._uid} blok={item} variant="desktop" />
          ))}
        </TopMenuDesktop>
      )}
      {variant === 'mobile' && (
        <TopMenuMobile defaultValue={productNavItem}>
          {blok.navMenuContainer.map((item) => (
            <NestedNavigationBlock key={item._uid} blok={item} variant="mobile" />
          ))}
        </TopMenuMobile>
      )}
      <ShoppingCartMenuItem />
    </Header>
  )
}
HeaderBlock.blockName = 'header'
