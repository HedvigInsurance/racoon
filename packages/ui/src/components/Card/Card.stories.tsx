import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { CrossIcon } from '../../icons'
import { tokens } from '../../theme'
import { Badge } from '../Badge/Badge'
import { BasePillow } from '../BasePillow/BasePillow'
import { IconButton } from '../Button/IconButton'
import { Card } from './Card'

type Controls = ComponentProps<typeof Card.Root>

const meta: Meta<Controls> = {
  title: 'Card',
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
      url: 'https://www.figma.com/file/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?type=design&node-id=16269-14623&mode=design&t=AWGrq69c6GtZiBoY-1',
    },
  },
}
export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
          <Card.HeaderAside>
            <IconButton variant="secondary">
              <CrossIcon />
            </IconButton>
          </Card.HeaderAside>
        </Card.Header>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}

export const WithBadge: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Header>
          <Card.Media>
            <BasePillow shouldFallback fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
          <Card.HeaderAside>
            <Badge color="green50">20%</Badge>
          </Card.HeaderAside>
        </Card.Header>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}

export const WithoutButton: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Header>
          <Card.Media>
            <BasePillow shouldFallback fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}

export const WithoutPillow: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant}>
        <Card.Header>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
          <Card.HeaderAside>
            <IconButton variant="secondary">
              <CrossIcon />
            </IconButton>
          </Card.HeaderAside>
        </Card.Header>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}
