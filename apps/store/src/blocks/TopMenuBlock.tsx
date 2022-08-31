import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon } from 'ui'
import { MenuIcon } from '@/components/TopMenu/MenuIcon'
import { ShoppingCartMenuItem } from '@/components/TopMenu/ShoppingCartMenuItem'
import {
  DialogCloseIcon,
  DialogContent,
  IconButton,
  Navigation,
  NavigationLink,
  NavigationPrimaryList,
  NavigationSecondaryList,
  NavigationTrigger,
  ToggleMenu,
  Wrapper,
} from '@/components/TopMenu/TopMenu'
import { ExpectedBlockType, LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
}> & {
  closeDialog: () => void
}

export const NavItemBlock = ({ blok, ...props }: NavItemBlockProps) => {
  const { closeDialog } = props

  return (
    <NavigationMenuPrimitive.Item value={blok.name} {...storyblokEditable(blok)}>
      <NavigationLink href={blok.link.cached_url} onSelect={closeDialog}>
        {blok.name}
      </NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}
NavItemBlock.blockName = 'navItem'

type NestedNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
}> & {
  activeItem: string
  closeDialog: () => void
}

export const NestedNavContainerBlock = ({ blok, ...props }: NestedNavContainerBlockProps) => {
  const { activeItem } = props

  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)
  return (
    <NavigationMenuPrimitive.Item value={blok.name}>
      <NavigationTrigger>
        {blok.name}
        {activeItem === `${blok.name}` ? (
          <CrossIcon size="1rem" />
        ) : (
          <ArrowForwardIcon size="1rem" />
        )}
      </NavigationTrigger>
      <NavigationMenuPrimitive.Content>
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <NavigationSecondaryList>
            {filteredNavItems
              ? filteredNavItems.map((nestedBlock) => (
                  <NavItemBlock blok={nestedBlock} key={nestedBlock._uid} {...props} />
                ))
              : null}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

type HeaderBlockProps = SbBaseBlockProps<{
  navMenuContainer: ExpectedBlockType<NestedNavContainerBlockProps>
}>

export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
  const [activeItem, setActiveItem] = useState('')
  const [open, setOpen] = useState(false)

  const closeDialog = useCallback(() => {
    setOpen(false)
    setActiveItem('')
  }, [])

  return (
    <Wrapper>
      <DialogPrimitive.Root open={open} onOpenChange={() => setOpen((prevOpen) => !prevOpen)}>
        <DialogPrimitive.Trigger asChild>
          <ToggleMenu>{open ? null : <MenuIcon />}</ToggleMenu>
        </DialogPrimitive.Trigger>
        <DialogContent>
          <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
            <NavigationPrimaryList>
              {blok.navMenuContainer.map((nestedBlok) => (
                <NestedNavContainerBlock
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  {...storyblokEditable(blok)}
                  activeItem={activeItem}
                  closeDialog={closeDialog}
                />
              ))}
            </NavigationPrimaryList>
          </Navigation>
          <DialogCloseIcon asChild>
            <IconButton>
              <CrossIcon />
            </IconButton>
          </DialogCloseIcon>
        </DialogContent>
      </DialogPrimitive.Root>
      <ShoppingCartMenuItem />
    </Wrapper>
  )
}
HeaderBlock.blockName = 'header'
