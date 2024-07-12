import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import clsx from 'clsx'
import { PlusIcon, MinusIcon } from 'ui'
import { HamburgerCloseIcon, HamburgerOpenIcon } from '../HamburgerIcon/HamburgerIcon'
import {
  navigationTrigger,
  navigationTriggerSubMenu,
  navigationTriggerLinkPadding,
  navigationTriggerHiddenLabel,
  hamburgerOpenGeneralMenu,
  hamburgerCloseGeneralMenu,
  closeIcon,
  openIcon,
} from './NavigationTrigger.css'

export const NavigationTriggerGeneralMenu = ({ children }: { children: string }) => {
  return (
    <NavigationMenuPrimitive.Trigger
      className={clsx(navigationTrigger, navigationTriggerSubMenu)}
      style={assignInlineVars({
        [navigationTriggerLinkPadding]: '0',
      })}
      // Prevent mouse events from closing the menu
      onPointerEnter={(event) => event.preventDefault()}
      onPointerLeave={(event) => event.preventDefault()}
      onPointerMove={(event) => event.preventDefault()}
    >
      <span className={clsx(navigationTriggerHiddenLabel)}>{children}</span>
      <PlusIcon className={openIcon} size="1rem" />
      <MinusIcon className={closeIcon} size="1rem" />
      <HamburgerOpenIcon className={hamburgerOpenGeneralMenu} />
      <HamburgerCloseIcon className={hamburgerCloseGeneralMenu} />
    </NavigationMenuPrimitive.Trigger>
  )
}
