'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlockNew/MenuItemBlock'
import {
  navigationItem,
  navigationMenuWrapper,
  navigationSecondaryItem,
  navigationSecondaryList,
} from '@/components/HeaderNew/Header.css'
import { NavigationContent } from '@/components/HeaderNew/NavigationContent'
import { SecondaryNavigationLink } from '@/components/HeaderNew/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/HeaderNew/NavigationTrigger'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type SubMenuBlockProps = SbBaseBlockProps<{
  name: string
  menuItems: ExpectedBlockType<MenuItemBlockProps>
  currentActiveItem?: string
}>
export const SubMenuBlock = ({ blok }: SubMenuBlockProps) => {
  const filteredMenuItems = filterByBlockType(blok.menuItems, MenuItemBlock.blockName)

  if (filteredMenuItems.length === 0) {
    return null
  }

  const firstMenuItem = filteredMenuItems[0]

  return (
    <NavigationMenuPrimitive.Item
      className={navigationItem}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      <NavigationTrigger href={getLinkFieldURL(firstMenuItem.link, firstMenuItem.name)}>
        {blok.name}
      </NavigationTrigger>
      <NavigationContent>
        <div className={navigationMenuWrapper}>
          <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
            <NavigationMenuPrimitive.List className={navigationSecondaryList}>
              {filteredMenuItems.map((nestedBlock) => (
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
SubMenuBlock.blockName = 'subMenu'
