import type { Meta, StoryObj } from '@storybook/react'
import { useState, type ComponentProps } from 'react'
import { InfoIcon } from '../../icons/InfoIcon'
import { Button } from '../Button/Button'
import { IconButton } from '../Button/IconButton'
import { Tooltip } from './Tooltip'

type Controls = ComponentProps<typeof Tooltip.Root>

const meta: Meta<Controls> = {
  title: 'Tooltip',
  component: Tooltip.Root,
}
export default meta

type Story = StoryObj<Controls>

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover me to show tooltip content</Tooltip.Trigger>
        <Tooltip.Content>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
}

export const WithCustomTrigger: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
}

export const controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen((currentOpenState) => !currentOpenState)

    return (
      <div style={{ maxWidth: '400px' }}>
        <Tooltip.Root open={isOpen}>
          <Tooltip.Trigger asChild>
            <Button onClick={toggle}>Clicking me toggles the tooltip</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Tooltip.Content>
        </Tooltip.Root>
      </div>
    )
  },
}
