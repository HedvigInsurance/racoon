import styled from '@emotion/styled'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import React, { useState } from 'react'
import { ChevronIcon, theme } from 'ui'
import { PageLink } from '@/utils/PageLink'
import { NavigationPrimaryList, NavigationSecondaryList, NavigationTrigger } from '../HeaderStyles'
import { NavigationLink, SecondaryNavigationLink } from '../NavigationLink'
import { TopMenuDesktopProps } from './TopMenuDesktop.stories'

export const Navigation = styled(NavigationMenuPrimitive.Root)({
  backgroundColor: theme.colors.gray200,
  fontSize: theme.fontSizes[3],
})

const TriggerIcon = styled(ChevronIcon)({
  transition: 'transform 300ms',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
})

const NavigationMenuPrimitiveItem = styled(NavigationMenuPrimitive.Item)(({ theme }) => ({
  padding: `0 ${theme.space[4]}`,
}))

const NavigationMenuPrimitiveContent = styled(NavigationMenuPrimitive.Content)(() => ({
  position: 'absolute',
  top: 'calc(MENU_BAR_HEIGHT_DESKTOP + 0.5rem)',
  left: '0.5rem',
}))

export const TopMenuDesktop = ({ currentActiveItem }: TopMenuDesktopProps) => {
  const [activeItem, setActiveItem] = useState(currentActiveItem || '')

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
