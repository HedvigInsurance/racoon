import { type Meta, type StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'
import { Space } from 'ui'
import * as RadioOptionList from './RadioOptionList'

type Args = ComponentProps<typeof RadioOptionList.Root> & {
  items: Array<
    ComponentProps<typeof RadioOptionList.ProductOption> & {
      icon?: boolean
    }
  >
}

const meta: Meta<Args> = {
  title: 'Components / Radio Option List',
  component: RadioOptionList.Root,
  render: (args) => (
    <RadioOptionList.Root>
      <Space y={0.5}>
        {args.items.map((itemProps, index) => (
          <RadioOptionList.ProductOption key={index} {...itemProps} />
        ))}
      </Space>
    </RadioOptionList.Root>
  ),
}

export default meta
type Story = StoryObj<Args>

export const WithProductOptions: Story = {
  args: {
    items: [
      {
        title: 'Hyresrätt',
        subtitle: 'För dig som hyr bostad',
        pillow: {
          src: 'https://a.storyblok.com/f/165473/832x832/fb3ddd4632/hedvig-pillows-rental.png',
        },
        value: 'RENT',
      },
      {
        title: 'Bostadsrätt',
        subtitle: 'För dig som äger din lägenhet',
        pillow: {
          src: 'https://a.storyblok.com/f/165473/832x832/fb3ddd4632/hedvig-pillows-rental.png',
        },
        value: 'BRF',
      },
    ],
  },
}
