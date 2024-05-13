'use client'
import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { mq, Space, theme } from 'ui'
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
}>

type ProductNavItem = { name: string; url: string; image?: string; label?: string }

export const ProductNavContainerBlock = ({ blok }: ProductNavContainerBlockProps) => {
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

  return (
    <>
      <MobileWrapper>{content}</MobileWrapper>

      <DesktopOnly>
        <NavigationMenuPrimitive.Item
          className={navigationItem}
          value={blok.name}
          {...storyblokEditable(blok)}
        >
          <Space y={{ base: 1.5, lg: 0 }}>
            <DesktopOnly>
              <NavigationTrigger href={PageLink.store({ locale })}>{blok.name}</NavigationTrigger>
            </DesktopOnly>
            <NavigationMenuPrimitive.Content className={navigationContent}>
              {content}
            </NavigationMenuPrimitive.Content>
          </Space>
        </NavigationMenuPrimitive.Item>
      </DesktopOnly>
    </>
  )
}
ProductNavContainerBlock.blockName = 'productNavContainer'

const DesktopOnly = styled.div({ display: 'none', [mq.lg]: { display: 'block' } })
const MobileWrapper = styled.div({
  paddingTop: theme.space.md,
  borderBottom: `1px solid ${theme.colors.borderOpaque1}`,
  [mq.lg]: { display: 'none' },
})

const ButtonNextLinkFullWidth = styled(ButtonNextLink)({ width: '100%' })

const NestedNavigationBlock = (block: HeaderBlockProps['blok']['navMenuContainer'][number]) => {
  const navContainer = checkBlockType<NestedNavContainerBlockProps['blok']>(
    block,
    NestedNavContainerBlock.blockName,
  )
  if (navContainer) {
    return <NestedNavContainerBlock key={navContainer._uid} blok={navContainer} />
  }

  const productNavContainer = checkBlockType<ProductNavContainerBlockProps['blok']>(
    block,
    ProductNavContainerBlock.blockName,
  )
  if (productNavContainer) {
    return <ProductNavContainerBlock key={productNavContainer._uid} blok={productNavContainer} />
  }

  const navBlock = checkBlockType<NavItemBlockProps['blok']>(block, NavItemBlock.blockName)
  if (navBlock) return <NavItemBlock key={navBlock._uid} blok={navBlock} />

  return null
}

export type HeaderBlockProps = SbBaseBlockProps<{
  navMenuContainer: ExpectedBlockType<
    NestedNavContainerBlockProps | NavItemBlockProps | ProductNavContainerBlockProps
  >
}> & {
  static?: boolean
}

// Performance considerations
// - this block is important for site-wide INP since it's present on most pages and is used often
// - we render both desktop and mobile menu to allow CSS-only switch between them when window is resized
// - desktop menu is memoized to avoid rerendering when mobile menu state changes
export const HeaderBlock = ({ blok, ...headerProps }: HeaderBlockProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  // close on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  const handleOpenChange = useCallback(
    (newValue: boolean) => startTransition(() => setIsOpen(newValue)),
    [],
  )

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
    <Header key={pathname} {...storyblokEditable(blok)} {...headerProps}>
      {variant === 'desktop' && (
        <TopMenuDesktop>{blok.navMenuContainer.map(NestedNavigationBlock)}</TopMenuDesktop>
      )}
      {variant === 'mobile' && (
        <TopMenuMobile
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          defaultValue={productNavItem}
        >
          {blok.navMenuContainer.map(NestedNavigationBlock)}
        </TopMenuMobile>
      )}
      <ShoppingCartMenuItem />
    </Header>
  )
}
HeaderBlock.blockName = 'header'
