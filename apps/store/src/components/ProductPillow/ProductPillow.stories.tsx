import { Meta, StoryFn } from '@storybook/react'
import { ProductPillow, ProductPillowProps } from './ProductPillow'

export default {
  title: 'Product Pillows / Product Pillow',
  component: ProductPillow,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ProductPillow>

const Template: StoryFn<ProductPillowProps> = (props) => {
  return <ProductPillow {...props} />
}

export const Default = Template.bind({})
Default.args = {
  name: 'Olycksfall',
  image: 'https://a.storyblok.com/f/165473/832x832/fa27811442/hedvig-pillow-home.png',
  url: '/',
}
