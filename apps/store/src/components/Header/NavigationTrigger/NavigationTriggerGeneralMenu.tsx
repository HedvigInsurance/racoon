import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'
import { MinusIcon } from 'ui/src/icons/MinusIcon'
import { PlusIcon } from 'ui/src/icons/PlusIcon'
import { HamburgerCloseIcon, HamburgerOpenIcon } from '../HamburgerIcon/HamburgerIcon'
import {
  navigationTrigger,
  navigationTriggerHiddenLabel,
  hamburgerOpenGeneralMenu,
  hamburgerCloseGeneralMenu,
  closeIcon,
  openIcon,
  navigationTriggerGeneralMenu,
} from './NavigationTrigger.css'

export const NavigationTriggerGeneralMenu = ({ children }: { children: string }) => {
  return (
    <NavigationMenuPrimitive.Trigger
      className={clsx(navigationTrigger, navigationTriggerGeneralMenu)}
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
