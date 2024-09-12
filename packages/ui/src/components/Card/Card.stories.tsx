import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { tokens } from '../../theme'
import { BasePillow } from '../BasePillow/BasePillow'
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
      url: 'https://www.figma.com/file/5kmmDdh6StpXzbEfr7WevV/Hedvig-UI-Kit?type=design&node-id=15721-17893&mode=design&t=FQrv0wWXT2aihaTB-1',
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
            <BasePillow shouldFallback fill={tokens.colors.amber300} />
          </Card.Media>
          <Card.Heading>
            <Card.Title>Homeowner Insurance</Card.Title>
            <Card.Subtitle>Bellmansgatan 19A</Card.Subtitle>
          </Card.Heading>
        </Card.Header>
        A short message about something that needs attention, an error, info or...
      </Card.Root>
    </div>
  ),
  args: {
    variant: 'primary',
  },
}
