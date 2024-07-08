import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import { HamburgerCloseIcon, HamburgerOpenIcon } from './HamburgerIcon/HamburgerIcon'
import {
  hamburgerCloseGeneralMenu,
  hamburgerOpenGeneralMenu,
  navigationTriggerHiddenLabel,
  navigationTriggerLink,
  navigationTriggerLinkPadding,
} from './Header.css'

export const NavigationTriggerGeneralMenu = ({ children }: { children: string }) => {
  return (
    <NavigationMenuPrimitive.Trigger
      className={navigationTriggerLink}
      style={assignInlineVars({
        [navigationTriggerLinkPadding]: '0',
      })}
      // Prevent mouse events from closing the menu
      onPointerEnter={(event) => event.preventDefault()}
      onPointerLeave={(event) => event.preventDefault()}
      onPointerMove={(event) => event.preventDefault()}
    >
      <span className={navigationTriggerHiddenLabel}>{children}</span>
      <HamburgerOpenIcon className={hamburgerOpenGeneralMenu} />
      <HamburgerCloseIcon className={hamburgerCloseGeneralMenu} />
    </NavigationMenuPrimitive.Trigger>
  )
}
