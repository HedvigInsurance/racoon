import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { useBreakpoint } from 'ui'
import { Header } from '@/components/Header/Header'
import {
  NavigationMenuPrimitiveContent,
  NavigationMenuPrimitiveItem,
  NavigationSecondaryList,
  NavigationTrigger,
  StyledArrowForwardIcon,
  StyledCrossIcon,
  StyledNavigationTrigger,
  TriggerIcon,
} from '@/components/Header/HeaderStyles'
import { NavigationLink, SecondaryNavigationLink } from '@/components/Header/NavigationLink'
import { TopMenu } from '@/components/Header/TopMenu'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import {
  checkBlockType,
  filterByBlockType,
  getLinkFieldURL,
} from '@/services/storyblok/Storyblok.helpers'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
}>

export const NavItemBlock = ({ blok }: NavItemBlockProps) => {
  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      <NavigationLink href={getLinkFieldURL(blok.link)}>{blok.name}</NavigationLink>
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
  const isDesktop = useBreakpoint('md')

  return (
    <NavigationMenuPrimitiveItem value={blok.name} {...storyblokEditable(blok)}>
      {isDesktop ? (
        <NavigationTrigger>
          {blok.name}
          <TriggerIcon size="16px" />
        </NavigationTrigger>
      ) : (
        <StyledNavigationTrigger>
          {blok.name}
          <StyledCrossIcon size="1rem" />
          <StyledArrowForwardIcon size="1rem" />
        </StyledNavigationTrigger>
      )}
      <NavigationMenuPrimitiveContent>
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <NavigationSecondaryList>
            {filteredNavItems.map((nestedBlock) => (
              <NavigationMenuPrimitiveItem
                key={nestedBlock._uid}
                value={nestedBlock.name}
                {...storyblokEditable(nestedBlock)}
              >
                <SecondaryNavigationLink href={getLinkFieldURL(nestedBlock.link)}>
                  {nestedBlock.name}
                </SecondaryNavigationLink>
              </NavigationMenuPrimitiveItem>
            ))}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitiveContent>
    </NavigationMenuPrimitiveItem>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

const getNestedNavigationBlock = (block: HeaderBlockProps['blok']['navMenuContainer'][number]) => {
  const navContainer = checkBlockType<NestedNavContainerBlockProps['blok']>(
    block,
    NestedNavContainerBlock.blockName,
  )
  if (navContainer) {
    return <NestedNavContainerBlock key={navContainer._uid} blok={navContainer} />
  }

  const navBlock = checkBlockType<NavItemBlockProps['blok']>(block, NavItemBlock.blockName)
  if (navBlock) return <NavItemBlock key={navBlock._uid} blok={navBlock} />

  return null
}

export type HeaderBlockProps = SbBaseBlockProps<{
  navMenuContainer: ExpectedBlockType<NestedNavContainerBlockProps | NavItemBlockProps>
}>

export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
  const isDesktop = useBreakpoint('md')

  return (
    <Header {...storyblokEditable(blok)}>
      {isDesktop ? (
        <TopMenu.Desktop navItems={blok.navMenuContainer.map(getNestedNavigationBlock)} />
      ) : (
        <TopMenu.Mobile navItems={blok.navMenuContainer.map(getNestedNavigationBlock)} />
      )}
    </Header>
  )
}
HeaderBlock.blockName = 'header'
