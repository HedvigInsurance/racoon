import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { Space } from 'ui'
import { Header } from '@/components/Header/Header'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
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
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import {
  checkBlockType,
  filterByBlockType,
  getLinkFieldURL,
} from '@/services/storyblok/Storyblok.helpers'
import { ButtonBlock, ButtonBlockProps } from './ButtonBlock'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
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
      <Space y={1}>
        <NavigationTrigger>{blok.name}</NavigationTrigger>
        <NavigationMenuPrimitiveContent>
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
        </NavigationMenuPrimitiveContent>
      </Space>
    </NavigationMenuPrimitiveItem>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

type ProductNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
  buttons?: ExpectedBlockType<ButtonBlockProps>
  currentActiveItem?: string
}>

export const ProductNavContainerBlock = ({ blok }: ProductNavContainerBlockProps) => {
  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)
  const buttonBlocks = filterByBlockType(blok.buttons, ButtonBlock.blockName)

  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      <NavigationTrigger>{blok.name}</NavigationTrigger>
      <NavigationMenuPrimitiveContent>
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <ProductNavigationList>
            {filteredNavItems.map((nestedBlock) => (
              <NavigationMenuSecondaryItem
                key={nestedBlock._uid}
                value={nestedBlock.name}
                {...storyblokEditable(nestedBlock)}
              >
                <ProductNavigationLink href={getLinkFieldURL(nestedBlock.link, nestedBlock.name)}>
                  {nestedBlock.name}
                </ProductNavigationLink>
              </NavigationMenuSecondaryItem>
            ))}
          </ProductNavigationList>
          {buttonBlocks.map((nestedBlock) => (
            <ButtonBlock blok={nestedBlock} key={nestedBlock._uid} />
          ))}
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitiveContent>
    </NavigationMenuPrimitiveItem>
  )
}
ProductNavContainerBlock.blockName = 'productNavContainer'

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
}>

export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
  return (
    <Header {...storyblokEditable(blok)}>
      <TopMenuDesktop>{blok.navMenuContainer.map(NestedNavigationBlock)}</TopMenuDesktop>
      <TopMenuMobile>{blok.navMenuContainer.map(NestedNavigationBlock)} </TopMenuMobile>
    </Header>
  )
}
HeaderBlock.blockName = 'header'
