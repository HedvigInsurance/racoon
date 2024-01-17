import { type ComponentProps } from 'react'
import { ProductReviews } from '@/components/ProductReviews/ProductReviews'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<ComponentProps<typeof ProductReviews>>

export const ProductReviewsBlock = ({ blok }: Props) => {
  return <ProductReviews {...blok} />
}

ProductReviewsBlock.blockName = 'productReviews'
