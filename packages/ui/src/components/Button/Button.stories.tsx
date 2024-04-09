import type { Meta, StoryFn } from '@storybook/react'
import { Space, CheckIcon } from 'ui'
import { Button } from './Button'

export default {
  title: 'Button',
  component: Button,
} as Meta<typeof Button>

const Template: StoryFn<typeof Button> = (props) => {
  return (
    <Space y={2} style={{ maxWidth: '20rem' }}>
      <Space y={1}>
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
      </Space>

      <Space y={1}>
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
      </Space>

      <Space y={1}>
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
      </Space>
    </Space>
  )
}

export const Large = Template.bind({})
Large.args = {
  children: 'Button label',
}

export const Medium = Template.bind({})
Medium.args = {
  children: 'Button label',
  size: 'medium',
}

export const Small = Template.bind({})
Small.args = {
  children: 'Button label',
  size: 'small',
}

export const Responsive = Template.bind({})
Responsive.args = {
  children: 'Button label',
  size: { base: 'small', lg: 'large' },
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: 'Button label',
  Icon: <CheckIcon size="18px" />,
}
