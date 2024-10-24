import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { Space } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsMetadata } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { AverageRating } from './AverageRating'
import { PillowHeader } from './PillowHeader'
import {
  wrapper,
  disclaimerText,
  reviewsDistributionSection,
  reviewsDistributionWrapper,
} from './ProductReviews.css'
import { ReviewsDialog } from './ReviewsDialog'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'

export type ProductReviewsProps = { showReviewComments?: boolean }

export const ProductReviews = ({ showReviewComments = true }: ProductReviewsProps) => {
  const { t } = useTranslation('reviews')

  const { name: productId, displayNameFull: productName, pillowImage } = useProductData()
  const productReviewsMetadata = useProuctReviewsMetadata()

  if (!productReviewsMetadata) {
    console.warn('ProductReviews | No product reviews metadata available')
    return null
  }

  const { averageRating, reviewsDistribution } = productReviewsMetadata

  return (
    <div className={wrapper}>
      <section>
        <AverageRating size={{ _: 9, sm: 11 }} score={averageRating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer
          className={disclaimerText}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={averageRating.totalOfReviews}
        />
      </section>

      <Space className={reviewsDistributionSection} y={2}>
        <div className={reviewsDistributionWrapper}>
          {reviewsDistribution.map(([score, percentage]) => (
            <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
          ))}
        </div>

        {showReviewComments && (
          <ReviewsDialog
            productIds={[productId]}
            Header={
              <PillowHeader
                title={productName}
                score={averageRating.score}
                reviewsCount={averageRating.totalOfReviews}
                pillow={pillowImage}
              />
            }
            reviewsDistribution={reviewsDistribution}
          >
            <Button variant="primary-alt" size="medium">
              {t('VIEW_REVIEWS_LABEL')}
            </Button>
          </ReviewsDialog>
        )}
      </Space>
    </div>
  )
}
