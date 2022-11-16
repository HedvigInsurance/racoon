import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon, Space, theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Pillow } from '../../Pillow/Pillow'
import { MenuIcon } from '../MenuIcon'
import { TopMenuMobileProps } from './TopMenuMobile.stories'

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
  fontSize: theme.fontSizes[5],
})

export const NavigationPrimaryList = styled(NavigationMenuPrimitive.List)(({ theme }) => ({
  all: 'unset',
  listStyle: 'none',
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[5],
  padding: `${theme.space[8]} ${theme.space[4]} 0`,
  backgroundColor: theme.colors.gray200,
}))

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)({
  all: 'unset',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space[1],
  rowGap: theme.space[4],
  fontSize: theme.fontSizes[2],
  paddingTop: theme.space[6],
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

export const TopMenuMobile = ({ isOpen, currentActiveItem }: TopMenuMobileProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')
  const [open, setOpen] = useState(false)

  const closeDialog = useCallback(() => {
    setOpen(false)
    setActiveItem('')
  }, [])

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={() => setOpen((prevOpen) => !prevOpen)}>
        <DialogPrimitive.Trigger asChild>
          <ToggleMenu>
            <MenuIcon />
          </ToggleMenu>
        </DialogPrimitive.Trigger>

        <DialogContent>
          <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
            <NavigationPrimaryList>
              <NavigationMenuPrimitive.Item value="insurances">
                <NavigationTrigger>
                  Insurances{' '}
                  {activeItem === 'insurances' ? (
                    <CrossIcon size="16px" />
                  ) : (
                    <ArrowForwardIcon size="16px" />
                  )}
                </NavigationTrigger>
                <NavigationMenuPrimitive.Content>
                  <NavigationMenuPrimitive.Sub defaultValue="browseAll">
                    <NavigationSecondaryList>
                      <NavigationMenuPrimitive.Item value="browseAll">
                        <SecondaryNavigationLink href={PageLink.store()} onSelect={closeDialog}>
                          Travel
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="homeInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Home
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="accidentInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Accident
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="carInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Student
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="carInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Olycksfall
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="carInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          House
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                    </NavigationSecondaryList>
                  </NavigationMenuPrimitive.Sub>
                </NavigationMenuPrimitive.Content>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="onlyAtHedvig">
                <NavigationLink href="#" onSelect={closeDialog}>
                  Only At Hedvig
                </NavigationLink>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="ourStory">
                <NavigationLink href="#" onSelect={closeDialog}>
                  Our Story
                </NavigationLink>
              </NavigationMenuPrimitive.Item>

              <NavigationMenuPrimitive.Item value="support">
                <NavigationLink href="#" onSelect={closeDialog}>
                  Support
                </NavigationLink>
              </NavigationMenuPrimitive.Item>
            </NavigationPrimaryList>
          </Navigation>

          <DialogCloseIcon asChild>
            <IconButton>
              <CrossIcon />
            </IconButton>
          </DialogCloseIcon>
        </DialogContent>
      </DialogPrimitive.Root>
    </>
  )
}

export const StyledDialogOverlay = styled(DialogPrimitive.Overlay)({
  position: 'fixed',
  inset: 0,
})

export const DialogContent = (props: DialogPrimitive.DialogContentProps) => {
  return (
    <DialogPrimitive.Portal>
      <StyledDialogOverlay />
      <DialogPrimitive.Content {...props} />
    </DialogPrimitive.Portal>
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
