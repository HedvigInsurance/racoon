import type { Meta, StoryFn } from '@storybook/react'
import { CheckIcon, yStack } from 'ui'
import { Button } from './Button'

type Controls = typeof Button

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
