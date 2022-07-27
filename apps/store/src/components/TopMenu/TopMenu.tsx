import styled from '@emotion/styled'
import * as NavigationMenuNative from '@radix-ui/react-navigation-menu'
import Link, { LinkProps } from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'
import { ArrowForwardIcon, CrossIcon, theme } from 'ui'
import { PageLink } from '@/lib/PageLink'
import { MiniCart } from '../MiniCart/MiniCart'
import { MenuIcon } from './MenuIcon'

const MENU_BAR_HEIGHT = '3.75rem'

export const TopMenu = () => {
  const [activeItem, setActiveItem] = useState('')
  const [open, setOpen] = useState(false)

  const closeMenu = useCallback(() => {
    setOpen(false)
    setActiveItem('')
  }, [])

  useEffect(
    function closeOnEscape() {
      const keyDownHandler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeMenu()
        }
      }

      document.addEventListener('keydown', keyDownHandler)

      return () => {
        document.removeEventListener('keydown', keyDownHandler)
      }
    },
    [closeMenu],
  )

  useEffect(
    function lockScrollWhenOpen() {
      const originalStyle = window.getComputedStyle(document.body).overflow

      if (open) {
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.body.style.overflow = originalStyle
      }
    },
    [open],
  )

  return (
    <Wrapper>
      <ToggleMenu
        aria-controls="primary-navigation"
        aria-expanded={open}
        onClick={() => setOpen((prevValue) => !prevValue)}
      >
        {open ? <CrossIcon /> : <MenuIcon />}
      </ToggleMenu>

      {open && (
        <Navigation value={activeItem} onValueChange={(activeItem) => setActiveItem(activeItem)}>
          <NavigationPrimaryList id="primary-navigation">
            <NavigationMenuNative.Item value="insurances">
              <NavigationTrigger>
                Insurances{' '}
                {activeItem === 'insurances' ? (
                  <CrossIcon size="16px" />
                ) : (
                  <ArrowForwardIcon size="16px" />
                )}
              </NavigationTrigger>
              <NavigationMenuNative.Content>
                <NavigationMenuNative.Sub defaultValue="browseAll">
                  <NavigationSecondaryList>
                    <NavigationMenuNative.Item value="browseAll">
                      <NavigationLink href={PageLink.store()} onSelect={closeMenu}>
                        Browse All
                      </NavigationLink>
                    </NavigationMenuNative.Item>

                    <NavigationMenuNative.Item value="homeInsurance">
                      <NavigationLink href="#" onSelect={closeMenu}>
                        Home Insurances
                      </NavigationLink>
                    </NavigationMenuNative.Item>

                    <NavigationMenuNative.Item value="accidentInsurance">
                      <NavigationLink href="#" onSelect={closeMenu}>
                        Accident Insurance
                      </NavigationLink>
                    </NavigationMenuNative.Item>

                    <NavigationMenuNative.Item value="carInsurance">
                      <NavigationLink href="#" onSelect={closeMenu}>
                        Car Insurance
                      </NavigationLink>
                    </NavigationMenuNative.Item>
                  </NavigationSecondaryList>
                </NavigationMenuNative.Sub>
              </NavigationMenuNative.Content>
            </NavigationMenuNative.Item>

            <NavigationMenuNative.Item value="onlyAtHedvig">
              <NavigationLink href="#" onSelect={closeMenu}>
                Only At Hedvig
              </NavigationLink>
            </NavigationMenuNative.Item>

            <NavigationMenuNative.Item value="ourStory">
              <NavigationLink href="#" onSelect={closeMenu}>
                Our Story
              </NavigationLink>
            </NavigationMenuNative.Item>

            <NavigationMenuNative.Item value="support">
              <NavigationLink href="#" onSelect={closeMenu}>
                Support
              </NavigationLink>
            </NavigationMenuNative.Item>
          </NavigationPrimaryList>
        </Navigation>
      )}

      <MiniCart />
    </Wrapper>
  )
}

const focusableStyles = {
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

const ToggleMenu = styled.button({
  cursor: 'pointer',
  ...focusableStyles,
})

const Navigation = styled(NavigationMenuNative.Root)({
  fontSize: theme.fontSizes[5],
})

const NavigationPrimaryList = styled(NavigationMenuNative.List)(({ theme }) => ({
  listStyle: 'none',
  position: 'fixed',
  inset: `${MENU_BAR_HEIGHT} 0 0 0`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[5],
  padding: `${theme.space[8]} ${theme.space[4]} 0`,
  backgroundColor: theme.colors.gray200,
  zIndex: 9999,
}))

const NavigationSecondaryList = styled(NavigationMenuNative.List)({
  all: 'unset',
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[3],
  paddingTop: theme.space[5],
  paddingLeft: theme.space[5],
  fontSize: theme.fontSizes[3],
})

const NavigationTrigger = styled(NavigationMenuNative.Trigger)({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  ...focusableStyles,
})

const StyledNavigationLink = styled(NavigationMenuNative.Link)({
  textDecoration: 'none',
  ...focusableStyles,
})

type NavigationLinkProps = Pick<LinkProps, 'href'> &
  Omit<NavigationMenuNative.NavigationMenuLinkProps, 'href'>

const NavigationLink = ({ href, ...rest }: NavigationLinkProps) => {
  return (
    <Link href={href} passHref>
      <StyledNavigationLink {...rest} />
    </Link>
  )
}
