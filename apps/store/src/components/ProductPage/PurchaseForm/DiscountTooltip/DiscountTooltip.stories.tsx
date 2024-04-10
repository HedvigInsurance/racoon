import type { StoryObj, Meta } from '@storybook/react'
import { DiscountTooltip } from './DiscountTooltip'

const meta: Meta<typeof DiscountTooltip> = {
  title: 'Purchase Form / Discount Tooltip',
  component: DiscountTooltip,
}

export default meta
type Story = StoryObj<typeof DiscountTooltip>

export const Default: Story = {
  args: {
    children: '50% rabatt i 3 månader',
    subtitle: 'Därefter betalar du 398 kr/mån',
  },
}

export const NoSubtitle: Story = {
  args: {
    children: '-10 kr/mån via Hedvig Forever',
  },
}
