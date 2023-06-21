import { Meta, StoryFn } from '@storybook/react'
import { ProductCard, ProductCardProps } from '@/components/ProductCard/ProductCard'
import { ProductGrid, ProductGridProps } from './ProductGrid'

export default {
  component: ProductGrid,
  argTypes: {},
} as Meta<typeof ProductGrid>

type ProductItem = ProductCardProps & { key: string }

const Template: StoryFn<ProductGridProps<ProductItem>> = (props) => {
  return <ProductGrid {...props}>{(itemProps) => <ProductCard {...itemProps} />}</ProductGrid>
}

export const Default = Template.bind({})
Default.args = {
  title: 'Popular insurances',
  items: [
    {
      key: '1',
      title: 'Hedvig Home',
      subtitle: 'Flexible and simple, for both renters and owners.',
      image: { src: 'https://via.placeholder.com/336x400' },
      link: { url: '/', type: 'product' },
    },
    {
      key: '2',
      title: 'Hedvig House',
      subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
      image: { src: 'https://via.placeholder.com/336x400' },
      link: { url: '/', type: 'product' },
    },
    {
      key: '3',
      title: 'Hedvig Car',
      subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
      image: { src: 'https://via.placeholder.com/336x400' },
      link: { url: '/', type: 'product' },
    },
    {
      key: '4',
      title: 'Hedvig Student',
      subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
      image: { src: 'https://via.placeholder.com/336x400' },
      link: { url: '/', type: 'product' },
    },
    {
      key: '3',
      title: 'Hedvig Accident',
      subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
      image: { src: 'https://via.placeholder.com/336x400' },
      link: { url: '/', type: 'product' },
    },
  ],
}
