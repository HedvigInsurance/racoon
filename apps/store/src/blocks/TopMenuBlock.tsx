import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import Link, { LinkProps } from 'next/link'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon, theme } from 'ui'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { MenuIcon } from '../components/TopMenu/MenuIcon'
import { ShoppingCartMenuItem } from '../components/TopMenu/ShoppingCartMenuItem'

const MENU_BAR_HEIGHT = '3.75rem'

type ConfigBlokProps = SbBaseBlockProps<{
  top_menu: SbBlokData[]
}>
export const Config = ({ blok }: ConfigBlokProps) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.top_menu.map((nestedBlok) => (
        <StoryblokComponent className="" blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  )
}

type NextedNavContainerBlokProps = SbBaseBlockProps<{
  name: string
  nav_item: SbBlokData[]
}> & {
  activeItem: string
  closeDialog: () => void
}

export const NestedNavContainerBlok = ({
  activeItem,
  closeDialog,
  blok,
}: NextedNavContainerBlokProps) => {
  console.log('nested nav container 🍒', blok, activeItem)

  return (
    <NavigationMenuPrimitive.Item key={blok._uid} value={blok.name}>
      <NavigationTrigger>
        {blok.name}
        {activeItem === `${blok.name}` ? (
          <CrossIcon size="16px" />
        ) : (
          <ArrowForwardIcon size="16px" />
        )}
      </NavigationTrigger>
      <NavigationMenuPrimitive.Content>
        <NavigationMenuPrimitive.Sub defaultValue="browseAll">
          <NavigationSecondaryList>
            {blok.nav_item &&
              blok.nav_item.map((nestedBlok) => (
                <StoryblokComponent
                  onSelect={closeDialog}
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                />
              ))}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}

type NavItemBlokProps = SbBaseBlockProps<{
  name: string
}> & {
  closeDialog: () => void
}

export const NavItemBlok = ({ blok, closeDialog }: NavItemBlokProps) => {
  console.log('NAV-ITEM', { blok, CLOSE: closeDialog })
  return (
    <NavigationMenuPrimitive.Item key={blok._uid} value={blok.name}>
      <NavigationLink href="#" onSelect={() => closeDialog()}>
        {blok.name}
      </NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}

type NavMenuContainerBlokProps = SbBaseBlockProps<{
  nav_item: SbBlokData[]
  rest: any
}>

export const NavMenuContainerBlok = ({ blok, ...rest }: NavMenuContainerBlokProps) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.nav_item.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} {...rest} />
      ))}
    </div>
  )
}

type TopMenuBlockProps = SbBaseBlockProps<{
  nav_items: SbBlokData[]
  nav_menu_container: SbBlokData[]
  nested_nav_item: SbBlokData[]
}>
export const TopMenuBlock = ({ blok }: TopMenuBlockProps) => {
  const [activeItem, setActiveItem] = useState('')
  const [open, setOpen] = useState(false)

  const closeDialog = useCallback(() => {
    setOpen(false)
    setActiveItem('')
  }, [])

  // console.log('🇸🇪🇸🇪🇸🇪 TOPMENU!', blok)

  return (
    <Wrapper style={{ marginTop: '4rem' }}>
      <DialogPrimitive.Root open={open} onOpenChange={() => setOpen((prevOpen) => !prevOpen)}>
        <DialogPrimitive.Trigger asChild>
          <ToggleMenu>
            <MenuIcon />
          </ToggleMenu>
        </DialogPrimitive.Trigger>

        <DialogContent>
          <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
            <NavigationPrimaryList>
              {blok.nav_menu_container.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={blok._uid} closeDialog={closeDialog} />
              ))}

              {blok.nested_nav_item &&
                blok.nested_nav_item.map((nestedBlok: SbBlokData) => {
                  return (
                    <StoryblokComponent
                      activeItem={null}
                      closeDialog={closeDialog}
                      blok={nestedBlok}
                      key={blok._uid}
                    />
                  )
                })}
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

const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100vw',
  height: MENU_BAR_HEIGHT,
  padding: theme.space[4],
}))

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
})

const DialogContent = (props: DialogPrimitive.DialogContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <StyledDialogOverlay />
      <DialogPrimitive.Content {...props} />
    </DialogPrimitive.Portal>
  )
}

const IconButton = styled.button({
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  lineHeight: 0,
  ...focusableStyles,
})

const ToggleMenu = styled.button({
  ...focusableStyles,
})

const Navigation = styled(NavigationMenuPrimitive.Root)({
  backgroundColor: theme.colors.gray200,
  fontSize: theme.fontSizes[5],
})

const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[5],
  padding: `${theme.space[10]} ${theme.space[4]} 0`,
  backgroundColor: theme.colors.gray200,
}))

const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)({
  all: 'unset',
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[3],
  paddingTop: theme.space[5],
  paddingLeft: theme.space[5],
  fontSize: theme.fontSizes[3],
})

const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

const StyledNavigationLink = styled(NavigationMenuPrimitive.Link)({
  textDecoration: 'none',
  ...focusableStyles,
})

type NavigationLinkProps = Pick<LinkProps, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'>

const NavigationLink = ({ href, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledNavigationLink {...rest} />
    </Link>
  )
}
