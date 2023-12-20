import { ProductReviews } from '@/components/ProductReviews/ProductReviews'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  tooltipText?: string
}>

export const ProductReviewsBlock = (props: Props) => {
  return <ProductReviews tooltipText={props.blok.tooltipText} />
}

ProductReviewsBlock.blockName = 'productReviews'
