import {
  NavigationTriggerDesktop,
  NavigationTriggerMobile,
  StyledArrowForwardIcon,
  StyledCrossIcon,
  TriggerIcon,
} from './HeaderStyles'

export const ResponsiveNavTrigger = ({ name }: { name: string }) => {
  return (
    <>
      <NavigationTriggerDesktop>
        {name}
        <TriggerIcon size="16px" />
      </NavigationTriggerDesktop>
      <NavigationTriggerMobile>
        {name}
        <StyledCrossIcon size="1rem" />
        <StyledArrowForwardIcon size="1rem" />
      </NavigationTriggerMobile>
    </>
  )
}
