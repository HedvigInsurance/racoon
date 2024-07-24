import type { Meta, StoryFn } from '@storybook/react'
import type { ProductCardProps } from '@/components/ProductCard/ProductCard'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import type { ProductGridProps } from './ProductGrid'
import { ProductGrid } from './ProductGrid'

const meta: Meta<typeof ProductGrid> = {
  component: ProductGrid,
  argTypes: {},
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta

type ProductItem = ProductCardProps

const Template: StoryFn<ProductGridProps & { items: Array<ProductItem> }> = (props) => {
  return (
    <ProductGrid {...props}>
      {props.items.map((itemProps) => (
        <ProductCard key={itemProps.title} {...itemProps} />
      ))}
    </ProductGrid>
  )
}

export const Default = {
  render: Template,
  args: {
    title: 'Popular insurances',
    items: [
      {
        title: 'Hedvig Home',
        subtitle: 'Flexible and simple, for both renters and owners.',
        image: { src: 'https://via.placeholder.com/336x400' },
        link: { url: '/', type: 'product' },
      },
      {
        title: 'Hedvig House',
        subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
        image: { src: 'https://via.placeholder.com/336x400' },
        link: { url: '/', type: 'product' },
      },
      {
        title: 'Hedvig Car',
        subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
        image: { src: 'https://via.placeholder.com/336x400' },
        link: { url: '/', type: 'product' },
      },
      {
        title: 'Hedvig Student',
        subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
        image: { src: 'https://via.placeholder.com/336x400' },
        link: { url: '/', type: 'product' },
      },
      {
        title: 'Hedvig Accident',
        subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
        image: { src: 'https://via.placeholder.com/336x400' },
        link: { url: '/', type: 'product' },
      },
    ],
  },
}
