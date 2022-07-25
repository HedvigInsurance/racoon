import { ComponentMeta, Story } from '@storybook/react'
import { ProductCard, ProductCardProps } from './ProductCard'

export default {
  title: 'Product Card',
  component: ProductCard,
  argTypes: {},
} as ComponentMeta<typeof ProductCard>

const Template: Story<ProductCardProps> = (props) => {
  return <ProductCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'Hedvig Car',
  subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
  image: { src: 'https://via.placeholder.com/336x400' },
}
