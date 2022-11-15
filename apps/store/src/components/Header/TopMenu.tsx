import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon, theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { Pillow } from '../Pillow/Pillow'
import { MenuIcon } from './MenuIcon'
import { Props } from './TopMenu.stories'

export const TopMenu = ({ isOpen, currentActiveItem }: Props) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem)
  const [open, setOpen] = useState(isOpen)

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
                          Browse All
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="homeInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Home Insurances
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="accidentInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Accident Insurance
                        </SecondaryNavigationLink>
                      </NavigationMenuPrimitive.Item>
                      <NavigationMenuPrimitive.Item value="carInsurance">
                        <SecondaryNavigationLink href="#" onSelect={closeDialog}>
                          Car Insurance
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

export const focusableStyles = {
  cursor: 'pointer',
  '&:focus-visible': {
    outline: `2px solid ${theme.colors.gray900}`,
  },
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
  padding: `${theme.space[10]} ${theme.space[4]} 0`,
  backgroundColor: theme.colors.gray200,
}))

export const NavigationSecondaryList = styled(NavigationMenuPrimitive.List)({
  all: 'unset',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space[2],
  fontSize: theme.fontSizes[2],
})

export const NavigationTrigger = styled(NavigationMenuPrimitive.Trigger)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

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

export const SecondaryNavigationLinkCard = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: `${theme.space[3]}`,
}))

export const SecondaryNavigationLink = ({ href, ...rest }: NavigationLinkProps) => {
  return (
    <SecondaryNavigationLinkCard>
      <Pillow size="xsmall" fromColor="green" toColor="palevioletred" />
      <Link href={href} passHref legacyBehavior>
        <StyledNavigationLink {...rest} />
      </Link>
    </SecondaryNavigationLinkCard>
  )
}

export const DialogCloseIcon = styled(DialogPrimitive.DialogClose)({
  position: 'fixed',
})
