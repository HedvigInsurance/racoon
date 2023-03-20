import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Meta, StoryFn } from '@storybook/react'
import { ProductCard, ProductCardProps } from './ProductCard'

export default {
  title: 'Product Card',
  component: ProductCard,
  argTypes: {},
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: 'iphone12',
    },
  },
} as Meta<typeof ProductCard>

const Template: StoryFn<ProductCardProps> = (props) => {
  return <ProductCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'Hedvig Car',
  subtitle: 'Lörem ipsum dålor, nufs plufs glufs och gruls.',
  image: {
    src: 'https://s3.eu-central-1.amazonaws.com/cdn.dev.hedvigit.com/giraffe_wallpaper.jpg',
  },
  aspectRatio: '4 / 5',
  link: { url: '/', type: 'product' },
}
