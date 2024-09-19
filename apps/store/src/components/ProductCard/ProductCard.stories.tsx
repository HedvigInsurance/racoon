import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { Badge, BasePillow, Button, Card, CrossIcon, IconButton, sprinkles, Text, tokens } from 'ui'
import { CurrencyCode } from '@/services/graphql/graphql'
import { InputStartDay } from '../InputDay/InputStartDay'
import { Price } from '../Price'
import { DetailsList } from './DetailsList/DetailsList'
import { Divider } from './Divider'
import { ProductCardDetails } from './ProductCardDetails'

type Controls = ComponentProps<typeof Card.Root>

const meta: Meta<Controls> = {
  title: 'Components / ProductCard',
  component: Card.Root,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
  },
  parameters: {
    design: {
      allowFullscreen: true,
      type: 'figma',
      url: 'https://www.figma.com/file/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?type=design&node-id=18673-5100',
    },
  },
}
export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Aside>
          <IconButton variant="secondary">
            <CrossIcon />
          </IconButton>
        </Card.Aside>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>

        <ProductCardDetails.Root>
          <ProductCardDetails.Trigger>
            {(isOpen) => (isOpen ? 'Hide details' : 'Show details')}
          </ProductCardDetails.Trigger>

          <ProductCardDetails.Content className={sprinkles({ paddingBlock: 'md' })}>
            <Text className={sprinkles({ mb: 'xxs' })}>Details</Text>
            <DetailsList.Root size="md" className={sprinkles({ mb: 'md' })}>
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
            <Button variant="secondary" size="medium" fullWidth>
              Edit information
            </Button>
          </ProductCardDetails.Content>
        </ProductCardDetails.Root>

        <InputStartDay />

        <DetailsList.Root>
          <DetailsList.Item>
            <DetailsList.Label>
              Homeowner Insurance{' '}
              <Badge color="pinkFill1" size="tiny">
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

        <Divider />

        <DetailsList.Root size="md">
          <DetailsList.Item className={sprinkles({ color: 'textPrimary' })}>
            <DetailsList.Label>Total</DetailsList.Label>
            <DetailsList.Value>
              <Price
                className={sprinkles({ justifyContent: 'flex-end' })}
                currencyCode={CurrencyCode.Sek}
                amount={458}
              />
            </DetailsList.Value>
          </DetailsList.Item>
        </DetailsList.Root>
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}
