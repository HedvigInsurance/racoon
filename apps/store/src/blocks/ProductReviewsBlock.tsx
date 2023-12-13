import { ProductReviews } from '@/components/ProductReviews/ProductReviews'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  calculationExplanation?: string
}>

export const ProductReviewsBlock = (props: Props) => {
  return <ProductReviews calculationExplanation={props.blok.calculationExplanation} />
}

ProductReviewsBlock.blockName = 'productReviews'
