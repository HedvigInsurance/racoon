import { ProductReviews } from '@/components/ProductReviews/ProductReviews'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  productAverageRatingThreshold?: number
}>

export const ProductReviewsBlock = ({ blok }: Props) => {
  return <ProductReviews productAverageRatingThreshold={blok.productAverageRatingThreshold} />
}

ProductReviewsBlock.blockName = 'productReviews'
