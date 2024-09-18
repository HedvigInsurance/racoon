import type { Meta, StoryObj } from '@storybook/react'
import { type ComponentProps } from 'react'
import { type Card } from 'ui'
import { ToggleCard } from './ToggleCard'

type Controls = ComponentProps<typeof Card.Root>

const meta: Meta<Controls> = {
  title: 'ToggleCard',
  component: ToggleCard.Root,
}
export default meta

type Story = StoryObj<Controls>

export const Checked: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ToggleCard.Root>
        <ToggleCard.Switch name="automatic-switching" id="product-auto-switch" defaultChecked />
        <ToggleCard.Label htmlFor='product-auto-switch"'>Automatic switching</ToggleCard.Label>
        <ToggleCard.Description>
          Hedvig will cancel your current insurance at Folksam. Your insurance at Hedvig activates
          automatically when it expires
        </ToggleCard.Description>
      </ToggleCard.Root>
    </div>
  ),
}

export const Unchecked: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ToggleCard.Root>
        <ToggleCard.Switch name="automatic-switching" id="product-auto-switch" />
        <ToggleCard.Label htmlFor='product-auto-switch"'>Automatic switching</ToggleCard.Label>
        <ToggleCard.Description>
          Hedvig will cancel your current insurance at Folksam. Your insurance at Hedvig activates
          automatically when it expires
        </ToggleCard.Description>
      </ToggleCard.Root>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <ToggleCard.Root>
        <ToggleCard.Switch name="automatic-switching" id="product-auto-switch" disabled />
        <ToggleCard.Label htmlFor='product-auto-switch"'>Automatic switching</ToggleCard.Label>
        <ToggleCard.Description>
          Hedvig will cancel your current insurance at Folksam. Your insurance at Hedvig activates
          automatically when it expires
        </ToggleCard.Description>
      </ToggleCard.Root>
    </div>
  ),
}
