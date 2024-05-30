import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { navigationTriggerLink } from './Header.css'

export const NavigationTrigger = (props: LinkProps & { children: string }) => {
  return (
    <NavigationMenuPrimitive.Trigger asChild>
      <Link className={navigationTriggerLink} {...props} />
    </NavigationMenuPrimitive.Trigger>
  )
}
