'use client'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import clsx from 'clsx'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlockNew/MenuItemBlock'
import {
  navigationItem,
  navigationMenuWrapper,
  navigationSecondaryItem,
  navigationSecondaryList,
  navigationItemGeneralMenu,
  navigationItemSubMenu,
} from '@/components/HeaderNew/Header.css'
import { NavigationContent } from '@/components/HeaderNew/NavigationContent'
import { SecondaryNavigationLink } from '@/components/HeaderNew/NavigationLink/NavigationLink'
import { NavigationTriggerGeneralMenu } from '@/components/HeaderNew/NavigationTrigger/NavigationTriggerGeneralMenu'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type GeneralMenuBlockProps = SbBaseBlockProps<{
  name: string
  menuItems: ExpectedBlockType<MenuItemBlockProps>
  currentActiveItem?: string
}>
export const GeneralMenuBlock = ({ blok }: GeneralMenuBlockProps) => {
  const filteredMenuItems = filterByBlockType(blok.menuItems, MenuItemBlock.blockName)

  if (filteredMenuItems.length === 0) {
    return null
  }

  return (
    <NavigationMenuPrimitive.Item
      className={clsx(navigationItem, navigationItemGeneralMenu, navigationItemSubMenu)}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      <NavigationTriggerGeneralMenu>{blok.name}</NavigationTriggerGeneralMenu>
      {/* Prevent closing the menu when cursor leaves content */}
      <NavigationContent onPointerLeave={(event) => event.preventDefault()}>
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
GeneralMenuBlock.blockName = 'generalMenu'
