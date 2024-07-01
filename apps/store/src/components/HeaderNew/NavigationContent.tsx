import {
  Content as NavigationMenuContent,
  type NavigationMenuContentProps,
} from '@radix-ui/react-navigation-menu'
import clsx from 'clsx'
import { navigationContent } from './Header.css'

export function NavigationContent({ className, ...forwardedProps }: NavigationMenuContentProps) {
  return (
    <NavigationMenuContent
      className={clsx(navigationContent, className)}
      {...forwardedProps}
      // For SEO reasons, we want to force the content to be mounted so navigation links are
      // accessible to search engines.
      forceMount={true}
      // Gotcha: For some reason when 'forceMount' is enable for navigation content, radix
      // considers clicks inside the content as outside clicks. This is a workaround to
      // prevent the behavior of closing the navigation menu when clicking on a link inside
      // the navigation content.
      onPointerDownOutside={(event) => event.preventDefault()}
    />
  )
}
