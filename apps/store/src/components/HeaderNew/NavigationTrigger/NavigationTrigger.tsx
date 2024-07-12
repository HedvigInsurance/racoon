import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { type NavigationMenuProps } from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'
import { navigationTrigger, navigationTriggerSubMenu } from './NavigationTrigger.css'

export const NavigationTrigger = ({ ...forwardedProps }: NavigationMenuProps) => {
  return (
    <NavigationMenuPrimitive.Trigger
      className={clsx(navigationTrigger, navigationTriggerSubMenu)}
      asChild
      {...forwardedProps}
    />
  )
}
