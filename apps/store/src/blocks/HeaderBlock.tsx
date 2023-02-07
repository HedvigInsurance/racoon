import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Space } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { Header } from '@/components/Header/Header'
import {
  NavigationMenuListWrapper,
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationMenuProductItem,
  NavigationMenuSecondaryItem,
  NavigationSecondaryList,
  NavigationTrigger,
  ProductNavigationList,
} from '@/components/Header/HeaderStyles'
import {
  NavigationLink,
  ProductNavigationLink,
  SecondaryNavigationLink,
} from '@/components/Header/NavigationLink'
import { TopMenuDesktop } from '@/components/Header/TopMenuDesktop/TopMenuDesktop'
import { TopMenuMobile } from '@/components/Header/TopMenuMobile/TopMenuMobile'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import {
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
import { PageLink } from '@/utils/PageLink'
import { ButtonBlockProps } from './ButtonBlock'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
  pillowImage?: StoryblokAsset
}>

export const NavItemBlock = ({ blok }: NavItemBlockProps) => {
  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      <NavigationLink href={getLinkFieldURL(blok.link, blok.name)}>{blok.name}</NavigationLink>
    </NavigationMenuPrimitiveItem>
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

  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      <NavigationTrigger>{blok.name}</NavigationTrigger>
      <NavigationMenuPrimitiveContent>
        <NavigationMenuListWrapper>
          <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
            <NavigationSecondaryList>
              {filteredNavItems.map((nestedBlock) => (
                <NavigationMenuSecondaryItem
                  key={nestedBlock._uid}
                  value={nestedBlock.name}
                  {...storyblokEditable(nestedBlock)}
                >
                  <SecondaryNavigationLink
                    href={getLinkFieldURL(nestedBlock.link, nestedBlock.name)}
                  >
                    {nestedBlock.name}
                  </SecondaryNavigationLink>
                </NavigationMenuSecondaryItem>
              ))}
            </NavigationSecondaryList>
          </NavigationMenuPrimitive.Sub>
        </NavigationMenuListWrapper>
      </NavigationMenuPrimitiveContent>
    </NavigationMenuPrimitiveItem>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

type ProductNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
  buttons: ExpectedBlockType<ButtonBlockProps>
  currentActiveItem?: string
}>

type ProductNavItem = { name: string; url: string; image?: string }

export const ProductNavContainerBlock = ({ blok }: ProductNavContainerBlockProps) => {
  const { t } = useTranslation()
  const productMetadata = useProductMetadata()
  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)

  const productNavItems: Array<ProductNavItem> = []
  filteredNavItems.forEach((item) => {
    const product = productMetadata?.find((product) => product.name === item.name)
    if (product) {
      productNavItems.push({
        name: product.displayNameShort,
        url: product.pageLink,
        image: product.pillowImage.src,
      })
    } else {
      productNavItems.push({
        name: item.name,
        url: getLinkFieldURL(item.link, item.name),
        image: item.pillowImage?.filename,
      })
    }
  })

  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      <Space y={{ base: 1.5, lg: 0 }}>
        <NavigationTrigger>{blok.name}</NavigationTrigger>
        <NavigationMenuPrimitiveContent>
          <NavigationMenuListWrapper>
            <Space y={{ base: 1.5, lg: 1 }}>
              <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
                <ProductNavigationList>
                  {productNavItems.map((item) => (
                    <NavigationMenuProductItem key={item.name} value={item.name}>
                      <ProductNavigationLink href={item.url} pillowImageSrc={item.image}>
                        {item.name}
                      </ProductNavigationLink>
                    </NavigationMenuProductItem>
                  ))}
                </ProductNavigationList>
              </NavigationMenuPrimitive.Sub>
              <ButtonNextLinkFullWidth href={PageLink.store()} variant="secondary" size="medium">
                {t('NAVIGATION_STORE_LINK')}
              </ButtonNextLinkFullWidth>
            </Space>
          </NavigationMenuListWrapper>
        </NavigationMenuPrimitiveContent>
      </Space>
    </NavigationMenuPrimitiveItem>
  )
}
ProductNavContainerBlock.blockName = 'productNavContainer'

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
  overlay?: boolean
}

export const HeaderBlock = ({ blok, overlay }: HeaderBlockProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Header {...storyblokEditable(blok)} opaque={isOpen} overlay={overlay}>
      <TopMenuDesktop>{blok.navMenuContainer.map(NestedNavigationBlock)}</TopMenuDesktop>
      <TopMenuMobile isOpen={isOpen} setIsOpen={setIsOpen}>
        {blok.navMenuContainer.map(NestedNavigationBlock)}
      </TopMenuMobile>
    </Header>
  )
}
HeaderBlock.blockName = 'header'
