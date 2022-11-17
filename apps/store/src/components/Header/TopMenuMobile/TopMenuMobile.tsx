import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon } from 'ui'
import { PageLink } from '@/utils/PageLink'
import {
  focusableStyles,
  Navigation,
  NavigationPrimaryList,
  NavigationSecondaryList,
  NavigationTrigger,
} from '../HeaderStyles'
import { MenuIcon } from '../MenuIcon'
import { NavigationLink, SecondaryNavigationLink } from '../NavigationLink'
import { TopMenuMobileProps } from './TopMenuMobile.stories'

export const IconButton = styled.button({
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  lineHeight: 0,
  ...focusableStyles,
})

export const ToggleMenu = styled.button({
  ...focusableStyles,
  '&[data-state=open]': {
    display: 'none',
  },
})

export const DialogCloseIcon = styled(DialogPrimitive.DialogClose)({
  position: 'fixed',
})

export const TopMenuMobile = ({ currentActiveItem }: TopMenuMobileProps) => {
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
