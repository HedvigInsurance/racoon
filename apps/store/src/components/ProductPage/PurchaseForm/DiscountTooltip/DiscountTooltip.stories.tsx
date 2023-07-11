import { Meta, StoryFn } from '@storybook/react'
import { DiscountTooltip } from './DiscountTooltip'

export default {
  title: 'Purchase Form / Discount Tooltip',
  component: DiscountTooltip,
} as Meta<typeof DiscountTooltip>

export const Default: StoryFn<typeof DiscountTooltip> = (props) => {
  return <DiscountTooltip {...props} />
}
Default.args = {
  children: '50% rabatt i 3 månader',
  subtitle: 'Därefter betalar du 398 kr/mån',
}

export const NoSubtitle: StoryFn<typeof DiscountTooltip> = (props) => {
  return <DiscountTooltip {...props} />
}
NoSubtitle.args = {
  children: '-10 kr/mån via Hedvig Forever',
}
