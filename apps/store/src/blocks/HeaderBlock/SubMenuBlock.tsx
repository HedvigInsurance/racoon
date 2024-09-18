import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'ui'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlock/MenuItemBlock'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import {
  navigationItem,
  navigationItemSubMenu,
  navigationItemSupportMenu,
  navigationMenuWrapper,
  navigationSecondaryItem,
  navigationSecondaryList,
} from '@/components/HeaderNew/Header.css'
import { NavigationContent } from '@/components/HeaderNew/NavigationContent'
import { SecondaryNavigationLink } from '@/components/HeaderNew/NavigationLink/NavigationLink'
import { NavigationTrigger } from '@/components/HeaderNew/NavigationTrigger/NavigationTrigger'
import { openIcon, closeIcon } from '@/components/HeaderNew/NavigationTrigger/NavigationTrigger.css'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type SubMenuBlockProps = SbBaseBlockProps<{
  name: string
  menuItems: ExpectedBlockType<MenuItemBlockProps>
  currentActiveItem?: string
}> & { variant: 'mobile' | 'desktop' }
export const SubMenuBlock = ({ blok, variant }: SubMenuBlockProps) => {
  const filteredMenuItems = filterByBlockType(blok.menuItems, MenuItemBlock.blockName)

  if (filteredMenuItems.length === 0) {
    return null
  }

  const firstMenuItem = filteredMenuItems[0]

  return (
    <NavigationMenuPrimitive.Item
      className={clsx(navigationItem, navigationItemSubMenu, navigationItemSupportMenu)}
      value={blok.name}
      {...storyblokEditable(blok)}
    >
      {variant === 'mobile' ? (
        <NavigationTrigger
          onPointerEnter={(event) => event.preventDefault()}
          onPointerLeave={(event) => event.preventDefault()}
          onPointerMove={(event) => event.preventDefault()}
        >
          <button>
            {blok.name}
            <PlusIcon className={openIcon} size="1rem" />
            <MinusIcon className={closeIcon} size="1rem" />
          </button>
        </NavigationTrigger>
      ) : (
        <NavigationTrigger>
          <ButtonNextLink
            size="medium"
            variant="secondary"
            href={getLinkFieldURL(firstMenuItem.link, firstMenuItem.name)}
          >
            {blok.name}
          </ButtonNextLink>
        </NavigationTrigger>
      )}
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
