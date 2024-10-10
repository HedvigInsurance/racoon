import type { Meta, StoryFn } from '@storybook/react'
import { type ComponentProps } from 'react'
import { CheckIcon, CrossIcon, yStack } from 'ui'
import { Button } from './Button'
import { IconButton } from './IconButton'

type Controls = ComponentProps<typeof Button>

const meta: Meta<Controls> = {
  title: 'Button',
  component: Button,
}

export default meta

const Template: StoryFn<Controls> = (props: Controls) => {
  return (
    <div className={yStack({ gap: 'xl' })}>
      <div className={yStack({ gap: 'md' })}>
        <div>
          <Button {...props} variant="primary" />
        </div>
        <div>
          <Button {...props} variant="primary-alt" />
        </div>
        <div>
          <Button {...props} variant="secondary" />
        </div>
        <div>
          <Button {...props} variant="secondary-alt" />
        </div>
        <div>
          <Button {...props} variant="ghost" />
        </div>
        <div>
          <Button {...props} variant="outline" />
        </div>
      </div>

      <div className={yStack({ gap: 'md' })}>
        <div>
          <Button {...props} variant="primary" disabled />
        </div>
        <div>
          <Button {...props} variant="primary-alt" disabled />
        </div>
        <div>
          <Button {...props} variant="secondary" disabled />
        </div>
        <div>
          <Button {...props} variant="secondary-alt" disabled />
        </div>
        <div>
          <Button {...props} variant="ghost" disabled />
        </div>
        <div>
          <Button {...props} variant="outline" disabled />
        </div>
      </div>

      <div className={yStack({ gap: 'md' })}>
        <div>
          <Button {...props} variant="primary" loading />
        </div>
        <div>
          <Button {...props} variant="primary-alt" loading />
        </div>
        <div>
          <Button {...props} variant="secondary" loading />
        </div>
        <div>
          <Button {...props} variant="secondary-alt" loading />
        </div>
        <div>
          <Button {...props} variant="ghost" loading />
        </div>
        <div>
          <Button {...props} variant="outline" loading />
        </div>
      </div>
    </div>
  )
}

export const Large = {
  render: Template,
  args: {
    children: 'Button label',
  },
}

export const Medium = {
  render: Template,
  args: {
    children: 'Button label',
    size: 'medium',
  },
}

export const Small = {
  render: Template,
  args: {
    children: 'Button label',
    size: 'small',
  },
}

export const Responsive = {
  render: Template,
  args: {
    children: 'Button label',
    size: { base: 'small', lg: 'large' },
  },
}

export const WithIcon = {
  render: Template,
  args: {
    children: 'Button label',
    Icon: <CheckIcon size="18px" />,
  },
}

export const IconButtonDefault = {
  render: (args: Controls) => <IconButton variant={args.variant}>{args.Icon}</IconButton>,
  args: {
    Icon: <CrossIcon size="18px" />,
    variant: 'primary',
  },
}
