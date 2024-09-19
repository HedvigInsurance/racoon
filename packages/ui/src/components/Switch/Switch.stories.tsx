import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { useState, type ComponentProps } from 'react'
import { Switch } from './Switch'

type Controls = ComponentProps<typeof Switch>

const meta: Meta<Controls> = {
  title: 'Switch',
  component: Switch,
}
export default meta

type Story = StoryObj<Controls>

export const Controlled: Story = {
  render: () => {
    const [checked, setIsChecked] = useState(true)

    const toggle = () => setIsChecked((isChecked) => !isChecked)

    return (
      <div style={{ maxWidth: '400px' }}>
        <Switch checked={checked} onCheckedChange={toggle} />
      </div>
    )
  },
}

export const Uncontrolled: Story = {
  render: (args: Controls) => {
    return (
      <div style={{ maxWidth: '400px' }}>
        <Switch defaultChecked onCheckedChange={args.onCheckedChange} />
      </div>
    )
  },
  args: {
    onCheckedChange: action('onCheckedChange'),
  },
}
