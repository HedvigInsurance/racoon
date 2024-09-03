import type { Meta, StoryObj } from '@storybook/react'
import { sprinkles } from '../../theme'
import * as Tabs from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    type: {
      options: ['default', 'filled'],
      control: { type: 'select' },
    },
  },
  args: {
    size: 'medium',
    type: 'filled',
  },
}

export default meta
type Story = StoryObj<typeof Tabs>

type TabArgs = {
  size: 'small' | 'medium' | 'large'
  type: 'default' | 'filled'
}

const TabsStory = (args: TabArgs) => {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List size={args.size} type={args.type}>
        <Tabs.Trigger size={args.size} value="overview">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger size={args.size} value="coverage">
          Coverage
        </Tabs.Trigger>
        <Tabs.Trigger size={args.size} value="documents">
          Documents
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <div
          className={sprinkles({ display: 'flex', justifyContent: 'center', paddingBlock: 'lg' })}
        >
          Overview
        </div>
      </Tabs.Content>
      <Tabs.Content value="coverage">
        <div
          className={sprinkles({ display: 'flex', justifyContent: 'center', paddingBlock: 'lg' })}
        >
          Coverage
        </div>
      </Tabs.Content>
      <Tabs.Content value="documents">
        <div
          className={sprinkles({ display: 'flex', justifyContent: 'center', paddingBlock: 'lg' })}
        >
          Documents
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

export const Filled: Story = {
  render: (args: TabArgs) => <TabsStory {...args} />,
}

export const Default: Story = {
  args: { type: 'default' },
  render: (args: TabArgs) => <TabsStory {...args} />,
}
