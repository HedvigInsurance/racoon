import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { CheckIcon } from '../../icons/CheckIcon'
import { InfoIcon } from '../../icons/InfoIcon'
import { StarIcon } from '../../icons/StarIcon'
import { WarningTriangleIcon } from '../../icons/WarningTriangleIcon'
import { Alert } from './Alert'

const iconNameMap = {
  InfoIcon,
  WarningTriangleIcon,
  CheckIcon,
  StarIcon,
}

const iconArg = {
  icon: {
    options: ['InfoIcon', 'WarningTriangleIcon', 'CheckIcon', 'StarIcon'],
    control: 'select',
  },
}

type Controls = ComponentProps<typeof Alert.Root> & {
  icon: keyof typeof iconNameMap
}

const meta: Meta<Controls> = {
  title: 'Alert',
  component: Alert.Root,
  argTypes: {
    variant: {
      options: ['info', 'warning', 'error', 'success'],
      control: { type: 'select' },
    },
  },
  args: {
    variant: 'info',
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
      <Alert.Root variant={args.variant}>
        <Alert.Body>
          <Alert.Message>
            A short message about something that needs attention, an error, info or...
          </Alert.Message>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
  args: {
    variant: 'info',
  },
}

export const WithIcon: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Alert.Root variant={args.variant}>
        <Alert.Icon icon={iconNameMap[args.icon]} />
        <Alert.Body>
          <Alert.Message>
            A short message about something that needs attention, an error, info or...
          </Alert.Message>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
  argTypes: iconArg,
  args: {
    icon: 'InfoIcon',
  },
}

export const WithActions: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Alert.Root variant={args.variant}>
        <Alert.Body>
          <Alert.Message>
            A short message about something that needs attention, an error, info or...
          </Alert.Message>
          <Alert.Actions>
            <Alert.Action>Button label</Alert.Action>
            <Alert.Action>Button label</Alert.Action>
          </Alert.Actions>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
}

export const WithIconAndActions: Story = {
  render: (args: Controls) => (
    <div style={{ maxWidth: '400px' }}>
      <Alert.Root variant={args.variant}>
        <Alert.Icon icon={iconNameMap[args.icon]} />
        <Alert.Body>
          <Alert.Message>
            A short message about something that needs attention, an error, info or...
          </Alert.Message>
          <Alert.Actions>
            <Alert.Action>Button label</Alert.Action>
            <Alert.Action>Button label</Alert.Action>
          </Alert.Actions>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
  argTypes: iconArg,
  args: {
    icon: 'InfoIcon',
  },
}
