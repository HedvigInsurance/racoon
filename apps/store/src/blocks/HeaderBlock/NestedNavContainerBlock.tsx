'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { NavItemBlock, type NavItemBlockProps } from '@/blocks/HeaderBlock/NavItemBlock'
import {
  navigationItem,
  navigationMenuWrapper,
  navigationSecondaryItem,
  navigationSecondaryList,
} from '@/components/Header/Header.css'
import { NavigationContent } from '@/components/Header/NavigationContent'
import { SecondaryNavigationLink } from '@/components/Header/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/Header/NavigationTrigger'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type NestedNavContainerBlockProps = SbBaseBlockProps<{
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
      <NavigationContent>
        <div className={navigationMenuWrapper}>
          <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
            <NavigationMenuPrimitive.List className={navigationSecondaryList}>
              {filteredNavItems.map((nestedBlock) => (
                <NavigationMenuPrimitive.Item
                  key={nestedBlock._uid}
                  className={navigationSecondaryItem}
                  value={nestedBlock.name}
                  {...storyblokEditable(nestedBlock)}
                >
                  <SecondaryNavigationLink
                    href={getLinkFieldURL(nestedBlock.link, nestedBlock.name)}
                  >
                    {nestedBlock.name}
                  </SecondaryNavigationLink>
                </NavigationMenuPrimitive.Item>
              ))}
            </NavigationMenuPrimitive.List>
          </NavigationMenuPrimitive.Sub>
        </div>
      </NavigationContent>
    </NavigationMenuPrimitive.Item>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'
