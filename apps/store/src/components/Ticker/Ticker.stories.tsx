import { type Meta, type StoryObj } from '@storybook/react'
import { Ticker, TickerItem } from './Ticker'

const meta: Meta<typeof Ticker> = {
  title: 'Components / Ticker',
  component: Ticker,
}

export default meta
type Story = StoryObj<typeof Ticker>

export const Primary: Story = {
  render: () => (
    <Ticker>
      <TickerItem>First item</TickerItem>
      <TickerItem>Second item</TickerItem>
      <TickerItem>Third item</TickerItem>
    </Ticker>
  ),
}
