import { type Meta, type StoryObj } from '@storybook/react'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import * as ProgressIndicator from './ProgressIndicator'

type Args = React.ComponentProps<typeof ProgressIndicator.Root> & {
  items: Array<
    React.ComponentProps<typeof ProgressIndicator.Step> & {
      icon?: boolean
    }
  >
}

const meta: Meta<Args> = {
  title: 'Components / Progress Indicator',
  component: ProgressIndicator.Root,
  parameters: { grid: { width: '1/3' } },
  render: (args) => (
    <ProgressIndicator.Root>
      {args.items.map((item, index) => (
        <ProgressIndicator.Step key={index} active={item.active}>
          {item.icon && <CheckIcon size="1rem" />}
          {item.children}
        </ProgressIndicator.Step>
      ))}
    </ProgressIndicator.Root>
  ),
}

export default meta
type Story = StoryObj<Args>

export const Default: Story = {
  args: {
    items: [{ children: 'Sign', active: true }, { children: 'Pay' }, { children: 'Done' }],
  },
}

export const WithIcons: Story = {
  args: {
    items: [
      { children: 'Sign', icon: true },
      { children: 'Pay', active: true },
      { children: 'Done' },
    ],
  },
}
