import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import React, { useState } from 'react'
import { ChevronIcon, Space, theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Pillow } from '../../Pillow/Pillow'
import { TopMenuDesktopProps } from './TopMenuDesktop.stories'

export const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
}

export const IconButton = styled.button({
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  lineHeight: 0,
  ...focusableStyles,
})

export const ToggleMenu = styled.button({
  ...focusableStyles,
})

export const Navigation = styled(NavigationMenuPrimitive.Root)({
  backgroundColor: theme.colors.gray200,
  fontSize: theme.fontSizes[3],
})

export const MENU_BAR_HEIGHT = '4.5rem' //remove
export const MODEL_OFFSET = '5rem' //remove
export const HALF_REM = '.5rem' //remove

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[5],
  backgroundColor: theme.colors.gray100,
  height: MENU_BAR_HEIGHT,
  paddingLeft: HALF_REM,
}))

const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `0 ${theme.space[4]}`,
}))

const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)(({ theme }) => ({
  position: 'absolute',
  top: MODEL_OFFSET,
  left: HALF_REM,
}))

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)({
  all: 'unset',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  rowGap: theme.space[4],
  fontSize: theme.fontSizes[2],
  backgroundColor: theme.colors.gray100,
  borderRadius: HALF_REM,
  padding: `${theme.space[4]} 0`,
})

export const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

export const DialogCloseIcon = styled(DialogPrimitive.DialogClose)({
  position: 'fixed',
})

export const TopMenuDesktop = ({ isOpen, currentActiveItem }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')
  // const [open, setOpen] = useState(isOpen || false)

  return (
    <>
      <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
        <NavigationPrimaryList>
          <NavigationMenuPrimitiveItem value="insurances">
            <NavigationTrigger>
              Insurances{' '}
              {activeItem === 'insurances' ? (
                <TriggerIcon size="16px" />
              ) : (
                <TriggerIcon size="16px" />
              )}
            </NavigationTrigger>
            <NavigationMenuPrimitiveContent>
              <NavigationMenuPrimitive.Sub defaultValue="browseAll">
                <NavigationSecondaryList>
                  <NavigationMenuPrimitiveItem value="browseAll">
                    <SecondaryNavigationLink href={PageLink.store()}>
                      Travel
                    </SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                  <NavigationMenuPrimitiveItem value="homeInsurance">
                    <SecondaryNavigationLink href="#">Home</SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                  <NavigationMenuPrimitiveItem value="accidentInsurance">
                    <SecondaryNavigationLink href="#">Accident</SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                  <NavigationMenuPrimitiveItem value="carInsurance">
                    <SecondaryNavigationLink href="#">Student</SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                  <NavigationMenuPrimitiveItem value="carInsurance">
                    <SecondaryNavigationLink href="#">Olycksfall</SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                  <NavigationMenuPrimitiveItem value="carInsurance">
                    <SecondaryNavigationLink href="#">House</SecondaryNavigationLink>
                  </NavigationMenuPrimitiveItem>
                </NavigationSecondaryList>
              </NavigationMenuPrimitive.Sub>
            </NavigationMenuPrimitiveContent>
          </NavigationMenuPrimitiveItem>

          <NavigationMenuPrimitiveItem value="onlyAtHedvig">
            <NavigationLink href="#">Only At Hedvig</NavigationLink>
          </NavigationMenuPrimitiveItem>

          <NavigationMenuPrimitiveItem value="ourStory">
            <NavigationLink href="#">Our Story</NavigationLink>
          </NavigationMenuPrimitiveItem>

          <NavigationMenuPrimitiveItem value="support">
            <NavigationLink href="#">Support</NavigationLink>
          </NavigationMenuPrimitiveItem>
        </NavigationPrimaryList>
      </Navigation>
    </>
  )
}

export const StyledNavigationLink = styled(NavigationMenuPrimitive.Link)({
  textDecoration: 'none',
  ...focusableStyles,
})

type NavigationLinkProps = Pick<LinkProps, 'href'> &
  Omit<NavigationMenuPrimitive.NavigationMenuLinkProps, 'href'>

export const NavigationLink = ({ href, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref legacyBehavior>
      <StyledNavigationLink {...rest} />
    </Link>
  )
}

export const SecondaryNavigationLinkCard = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const StyledPillow = styled(Pillow)(({ theme }) => ({
  marginRight: theme.space[3],
}))

export const SecondaryNavigationLink = ({ href, ...rest }: NavigationLinkProps) => {
  return (
    <>
      <SecondaryNavigationLinkCard>
        <StyledPillow size="xsmall" fromColor="dodgerblue" toColor="palevioletred" />
        <Link href={href} passHref legacyBehavior>
          <StyledNavigationLink {...rest} />
        </Link>
      </SecondaryNavigationLinkCard>
    </>
  )
}
