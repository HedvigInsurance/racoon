import { ProductReviews } from '@/components/ProductReviews/ProductReviews'
import { ProductReviewsV2 } from '@/components/ProductReviews/ProductReviewsV2'
import { Features } from '@/utils/Features'

export const ProductReviewsBlock = () => {
  return Features.enabled('PRODUCT_REVIEWS_V2') ? <ProductReviewsV2 /> : <ProductReviews />
}

ProductReviewsBlock.blockName = 'productReviews'
