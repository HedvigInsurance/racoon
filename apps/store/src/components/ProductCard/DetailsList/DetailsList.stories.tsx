import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { Badge, Text, yStack } from 'ui'
import { CurrencyCode } from '@/services/graphql/graphql'
import { Price } from '../../Price'
import { DetailsList } from './DetailsList'

type Controls = ComponentProps<typeof DetailsList.Root>

const meta: Meta<Controls> = {
  title: 'Components / ProductCard / DetailsList',
  component: DetailsList.Root,
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?type=design&node-id=16269-14623&t=KfZGhlcQELqgimtF-1',
    },
  },
}
export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <DetailsList.Root>
        <DetailsList.Item>
          <DetailsList.Label>
            Homeowner insurance{' '}
            <Badge size="tiny" color="pinkFill1">
              Max
            </Badge>
          </DetailsList.Label>
          <DetailsList.Value>379 kr/mo</DetailsList.Value>
        </DetailsList.Item>

        <DetailsList.Item>
          <DetailsList.Label>Extended travel 60 days</DetailsList.Label>
          <DetailsList.Value>79 kr/mo</DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>
    </div>
  ),
}

export const Large: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Text size="lg">Details</Text>
      <DetailsList.Root size="lg">
        <DetailsList.Item>
          <DetailsList.Label>Home type</DetailsList.Label>
          <DetailsList.Value>Homeowner</DetailsList.Value>
        </DetailsList.Item>

        <DetailsList.Item>
          <DetailsList.Label>Address</DetailsList.Label>
          <DetailsList.Value>Bellmansgatan 19A</DetailsList.Value>
        </DetailsList.Item>

        <DetailsList.Item>
          <DetailsList.Label>Zip code</DetailsList.Label>
          <DetailsList.Value>118 47</DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>
    </div>
  ),
}

export const TotalPrice: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <DetailsList.Root size="lg">
        <DetailsList.Item>
          <DetailsList.Label>Total</DetailsList.Label>
          <DetailsList.Value className={yStack({ alignItems: 'flex-end' })}>
            <Price currencyCode={CurrencyCode.Sek} reducedAmount={300} amount={379} />
            <Text size="sm">-20% for 3 months, then 379 kr/mo</Text>
          </DetailsList.Value>
        </DetailsList.Item>
      </DetailsList.Root>
    </div>
  ),
}
