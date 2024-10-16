import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { type FormEvent } from 'react'
import { Discount } from './Discount'

type Controls = {
  onOpenChange?: (isOpen: boolean) => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

const meta: Meta<typeof Discount.Root> = {
  title: 'Components / ProductCard / Discount',
  component: Discount.Root,
}
export default meta

type Story = StoryObj<Controls>

export const Inactive: Story = {
  render: (args: Controls) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      args.onSubmit?.(event)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Discount.Root onOpenChange={args.onOpenChange}>
          <Discount.Form onSubmit={handleSubmit} />
        </Discount.Root>
      </div>
    )
  },
  args: {
    onOpenChange: action('onOpenChange'),
    onSubmit: action('onSubmit'),
  },
}

export const Active: Story = {
  render: (args: Controls) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      args.onSubmit?.(event)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Discount.Root onOpenChange={args.onOpenChange} defaultOpen>
          <Discount.Form onSubmit={handleSubmit} />
        </Discount.Root>
      </div>
    )
  },
  args: {
    onOpenChange: action('onOpenChange'),
    onSubmit: action('onSubmit'),
  },
}

export const Loading: Story = {
  render: (args: Controls) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      args.onSubmit?.(event)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Discount.Root onOpenChange={args.onOpenChange} defaultOpen>
          <Discount.Form onSubmit={handleSubmit} loading />
        </Discount.Root>
      </div>
    )
  },
  args: {
    onOpenChange: action('onOpenChange'),
    onSubmit: action('onSubmit'),
  },
}

export const Error: Story = {
  render: (args: Controls) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      args.onSubmit?.(event)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Discount.Root onOpenChange={args.onOpenChange} defaultOpen>
          <Discount.Form onSubmit={handleSubmit} errorMessage="Invalid code" />
        </Discount.Root>
      </div>
    )
  },
  args: {
    onOpenChange: action('onOpenChange'),
    onSubmit: action('onSubmit'),
  },
}

export const Applied: Story = {
  render: (args: Controls) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      args.onSubmit?.(event)
    }

    return (
      <div style={{ maxWidth: '400px' }}>
        <Discount.Root onOpenChange={args.onOpenChange} defaultOpen>
          <Discount.Code onSubmit={handleSubmit} code="SUMMER">
            3 months for free
          </Discount.Code>
        </Discount.Root>
      </div>
    )
  },
  args: {
    onOpenChange: action('onOpenChange'),
    onSubmit: action('onSubmit'),
  },
}
