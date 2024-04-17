'use client'

import {
  ProductReviews,
  type ProductReviewsProps,
} from '@/components/ProductReviews/ProductReviews'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<ProductReviewsProps>

export const ProductReviewsBlock = (props: Props) => {
  return <ProductReviews showReviewComments={props.blok.showReviewComments} />
}
