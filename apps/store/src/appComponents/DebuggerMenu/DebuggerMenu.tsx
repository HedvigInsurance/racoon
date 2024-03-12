'use client'

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { navigation, navigationItem, navigationPrimaryList } from '@/components/Header/Header.css'
import { NavigationLink } from '@/components/Header/NavigationLink/NavigationLink'

export function DebuggerMenu() {
  return (
    <NavigationMenuPrimitive.Root className={navigation}>
      <NavigationMenuPrimitive.List className={navigationPrimaryList}>
        <NavigationMenuPrimitive.Item className={navigationItem}>
          <NavigationLink href="/debugger">Session Debugger</NavigationLink>
        </NavigationMenuPrimitive.Item>
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}
