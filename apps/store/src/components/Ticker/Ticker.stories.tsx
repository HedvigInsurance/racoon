import { type Meta, type StoryObj } from '@storybook/react'
import { Heading } from 'ui'
import { Ticker, TickerItem } from './Ticker'

const meta: Meta<typeof Ticker> = {
  title: 'Components / Ticker',
  component: Ticker,
}

export default meta
type Story = StoryObj<typeof Ticker>

export const Primary: Story = {
  render: () => (
    <Ticker size={'xs'}>
      <TickerItem showCheckIcon={true}>First item</TickerItem>
      <TickerItem showCheckIcon={true}>Second item</TickerItem>
      <TickerItem showCheckIcon={true}>Third item</TickerItem>
    </Ticker>
  ),
}

export const WithHeading: Story = {
  render: () => (
    <Ticker size={10}>
      <TickerItem>
        <Heading as="h2" variant={{ _: 'serif.40', md: 'serif.72' }}>
          Hemförsäkring
        </Heading>
      </TickerItem>
      <TickerItem>
        <Heading as="h2" variant={{ _: 'serif.40', md: 'serif.72' }}>
          Bilförsäkring
        </Heading>
      </TickerItem>
      <TickerItem>
        <Heading as="h2" variant={{ _: 'serif.40', md: 'serif.72' }}>
          Djurförsäkring
        </Heading>
      </TickerItem>
    </Ticker>
  ),
}
