import styled from '@emotion/styled'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import React, { useState, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon, theme } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { MenuIcon } from './MenuIcon'
import { ShoppingCartMenuItem } from './ShoppingCartMenuItem'

const MENU_BAR_HEIGHT = '3.75rem'

export const TopMenu = () => {
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
                        <NavigationLink href={PageLink.store()} onSelect={closeDialog}>
                          Browse All
                        </NavigationLink>
                      </NavigationMenuPrimitive.Item>

                      <NavigationMenuPrimitive.Item value="homeInsurance">
                        <NavigationLink href="#" onSelect={closeDialog}>
                          Home Insurances
                        </NavigationLink>
                      </NavigationMenuPrimitive.Item>

                      <NavigationMenuPrimitive.Item value="accidentInsurance">
                        <NavigationLink href="#" onSelect={closeDialog}>
                          Accident Insurance
                        </NavigationLink>
                      </NavigationMenuPrimitive.Item>

                      <NavigationMenuPrimitive.Item value="carInsurance">
                        <NavigationLink href="#" onSelect={closeDialog}>
                          Car Insurance
                        </NavigationLink>
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
  width: '100%',
  height: MENU_BAR_HEIGHT,
  padding: theme.space[4],
  backgroundColor: theme.colors.gray200,
  color: theme.colors.gray900,
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
