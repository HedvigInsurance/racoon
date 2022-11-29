import { useBreakpoint } from 'ui'
import {
  NavigationTrigger,
  StyledArrowForwardIcon,
  StyledCrossIcon,
  StyledNavigationTrigger,
  TriggerIcon,
} from './HeaderStyles'

export const ResponsiveNavTrigger = ({ name }: { name: string }) => {
  const isDesktop = useBreakpoint('md')

  return isDesktop ? (
    <NavigationTrigger>
      {name}
      <TriggerIcon size="16px" />
    </NavigationTrigger>
  ) : (
    <StyledNavigationTrigger>
      {name}
      <StyledCrossIcon size="1rem" />
      <StyledArrowForwardIcon size="1rem" />
    </StyledNavigationTrigger>
  )
}
