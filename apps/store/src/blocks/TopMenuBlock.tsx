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

type NestedNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  nav_item: SbBlokData[]
}> & {
  activeItem: string
  closeDialog: () => void
}

export const NestedNavContainerBlock = ({ blok, ...rest }: NestedNavContainerBlockProps) => {
  const { activeItem } = rest
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
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <NavigationSecondaryList>
            {blok.nav_item &&
              blok.nav_item.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} {...rest} />
              ))}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}

type NavItemBlockProps = SbBaseBlockProps<{
  name: string
  link?: string
}> & {
  closeDialog: () => void
}

export const NavItemBlock = ({ blok, ...rest }: NavItemBlockProps) => {
  const { closeDialog } = rest

  return (
    <NavigationMenuPrimitive.Item key={blok._uid} value={blok.name}>
      <NavigationLink href="#" onSelect={closeDialog}>
        {blok.name}
      </NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}

type TopMenuBlockProps = SbBaseBlockProps<{
  nav_menu_container: SbBlokData[]
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
              {blok?.nav_menu_container &&
                blok.nav_menu_container.map((nestedBlok: SbBlokData) => {
                  return (
                    <div key={blok._uid} {...storyblokEditable(blok)}>
                      <StoryblokComponent
                        activeItem={activeItem}
                        closeDialog={closeDialog}
                        blok={nestedBlok}
                      />
                    </div>
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
