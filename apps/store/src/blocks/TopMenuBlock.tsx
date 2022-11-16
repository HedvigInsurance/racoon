import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { storyblokEditable } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ArrowForwardIcon, CrossIcon } from 'ui'
import { Wrapper } from '@/components/Header/Header'
import { MenuIcon } from '@/components/Header/MenuIcon'
import { ShoppingCartMenuItem } from '@/components/Header/ShoppingCartMenuItem'
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
} from '@/components/Header/TopMenuMobile/TopMenuMobile'
import { useStickyTopMenuOffset } from '@/components/Header/useTopMenuStickyOffset'
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
    <NavigationMenuPrimitive.Item value={blok.name} {...storyblokEditable(blok)}>
      <NavigationLink href={getLinkFieldURL(blok.link)}>{blok.name}</NavigationLink>
    </NavigationMenuPrimitive.Item>
  )
}
NavItemBlock.blockName = 'navItem'

type NestedNavContainerBlockProps = SbBaseBlockProps<{
  name: string
  navItems: ExpectedBlockType<NavItemBlockProps>
}>

export const NestedNavContainerBlock = ({ blok }: NestedNavContainerBlockProps) => {
  const filteredNavItems = filterByBlockType(blok.navItems, NavItemBlock.blockName)

  return (
    <NavigationMenuPrimitive.Item value={blok.name} {...storyblokEditable(blok)}>
      <StyledNavigationTrigger>
        {blok.name}
        <StyledCrossIcon size="1rem" />
        <StyledArrowForwardIcon size="1rem" />
      </StyledNavigationTrigger>
      <NavigationMenuPrimitive.Content>
        <NavigationMenuPrimitive.Sub defaultValue={blok.name}>
          <NavigationSecondaryList>
            {filteredNavItems.map((nestedBlock) => (
              <NavItemBlock key={nestedBlock._uid} blok={nestedBlock} />
            ))}
          </NavigationSecondaryList>
        </NavigationMenuPrimitive.Sub>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}
NestedNavContainerBlock.blockName = 'nestedNavContainer'

const StyledCrossIcon = styled(CrossIcon)()
const StyledArrowForwardIcon = styled(ArrowForwardIcon)()

const StyledNavigationTrigger = styled(NavigationTrigger)({
  ['&[data-state=open]']: {
    [StyledArrowForwardIcon.toString()]: { display: 'none' },
  },
  '&[data-state=closed]': {
    [StyledCrossIcon.toString()]: { display: 'none' },
  },
})

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
  const [open, setOpen] = useState(false)

  const router = useRouter()
  useEffect(() => {
    const closeDialog = () => setOpen(false)
    router.events.on('routeChangeComplete', closeDialog)
    return () => router.events.off('routeChangeComplete', closeDialog)
  }, [router.events])

  const { topOffset, navRef } = useStickyTopMenuOffset()

  return (
    <Wrapper ref={navRef} topOffset={topOffset} {...storyblokEditable(blok)}>
      <DialogPrimitive.Root open={open} onOpenChange={() => setOpen((prevOpen) => !prevOpen)}>
        <DialogPrimitive.Trigger asChild>
          <ToggleMenu>{open ? null : <MenuIcon />}</ToggleMenu>
        </DialogPrimitive.Trigger>
        <DialogContent>
          <Navigation>
            <NavigationPrimaryList>
              {blok.navMenuContainer.map(getNestedNavigationBlock)}
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
