import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon } from 'ui'
import { MenuIcon } from '@/components/TopMenu/MenuIcon'
import { ShoppingCartMenuItem } from '@/components/TopMenu/ShoppingCartMenuItem'
import {
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
import { LinkField, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link: LinkField
}> & {
  closeDialog: () => void
}

export const NavItemBlock = ({ blok, ...props }: NavItemBlockProps) => {
  const { closeDialog } = props

  return (
    <NavigationMenuPrimitive.Item key={blok._uid} value={blok.name} {...storyblokEditable(blok)}>
      <NavigationLink href={blok.link.url} onSelect={closeDialog}>
        {blok.name}
      </NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}

type NestedNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: SbBlokData[]
}> & {
  activeItem: string
  closeDialog: () => void
}

export const NestedNavContainerBlock = ({ blok, ...props }: NestedNavContainerBlockProps) => {
  const { activeItem } = props
  return (
    <NavigationMenuPrimitive.Item key={blok._uid} value={blok.name}>
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
            {blok.navItems
              ? blok.navItems.map((nestedBlock) => (
                  <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} {...props} />
                ))
              : null}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}

type TopMenuBlockProps = SbBaseBlockProps<{
  navMenuContainer: SbBlokData[]
}>
export const TopMenuBlock = ({ blok }: TopMenuBlockProps) => {
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
          <ToggleMenu>
            <MenuIcon />
          </ToggleMenu>
        </DialogPrimitive.Trigger>
        <DialogContent>
          <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
            <NavigationPrimaryList>
              {blok.navMenuContainer.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={blok._uid}
                  {...storyblokEditable(blok)}
                  activeItem={activeItem}
                  closeDialog={closeDialog}
                />
              ))}
            </NavigationPrimaryList>
          </Navigation>
          <DialogPrimitive.DialogClose asChild>
            <IconButton>
              <CrossIcon />
            </IconButton>
          </DialogPrimitive.DialogClose>
        </DialogContent>
      </DialogPrimitive.Root>
      <ShoppingCartMenuItem />
    </Wrapper>
  )
}
