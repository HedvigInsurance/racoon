import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { CrossIcon } from '../../icons/CrossIcon'
import { InfoIcon } from '../../icons/InfoIcon'
import { tokens } from '../../theme'
import { Badge } from '../Badge/Badge'
import { BasePillow } from '../BasePillow/BasePillow'
import { IconButton } from '../Button/IconButton'
import { Text } from '../Text/Text'
import { Tooltip } from '../Tooltip/Tooltip'
import { Card } from './Card'

type Controls = ComponentProps<typeof Card.Root>

const meta: Meta<Controls> = {
  title: 'Card',
  component: Card.Root,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'ghost'],
      control: { type: 'select' },
    },
    size: {
      options: ['md', 'lg'],
      control: { type: 'radio' },
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
      <Card.Root variant={args.variant} size={args.size}>
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'lg',
  },
}

export const WithBadge: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant} size={args.size}>
        <Card.Aside>
          <Badge color="green50">20%</Badge>
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
    size: 'lg',
  },
}

export const WithoutAside: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant} size={args.size}>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
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
    size: 'lg',
  },
}

export const WithoutPillow: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant} size={args.size}>
        <Card.Header>
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
    size: 'lg',
  },
}

export const Secondary: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant} size={args.size}>
        <Tooltip.Root>
          <Card.Aside>
            <Tooltip.Trigger>
              <InfoIcon size="24px" color={tokens.colors.borderOpaque3} />
            </Tooltip.Trigger>
          </Card.Aside>
          <Tooltip.Content className="TooltipContent" sideOffset={5}>
            Lorem ipsum dolor sit amet.
          </Tooltip.Content>
        </Tooltip.Root>
        <Text>Order summary</Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam fugit cumque unde
        officiis, reprehenderit accusamus tempora.
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'secondary',
    size: 'md',
  },
}

export const Ghost: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Card.Root variant={args.variant} size={args.size}>
        <Card.Header>
          <Card.Media>
            <BasePillow fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'ghost',
    size: 'md',
  },
}
