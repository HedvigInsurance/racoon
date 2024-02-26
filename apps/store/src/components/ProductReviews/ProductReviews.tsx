import { useTranslation } from 'next-i18next'
import { Button, Space } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
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
import { useReviews } from './useReviews'

export const ProductReviews = () => {
  const { t } = useTranslation('reviews')

  const { displayNameFull: productName, pillowImage } = useProductData()
  const productReviewsData = useProuctReviewsDataContext()
  const { rating, reviews, reviewsDistribution, setSelectedScore, selectedScore } =
    useReviews(productReviewsData)

  if (!rating) {
    console.warn('ProductReviews | No rating data available')
    return null
  }

  return (
    <div className={wrapper}>
      <section>
        <AverageRating size={{ _: 9, sm: 11 }} score={rating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer
          className={disclaimerText}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={rating.totalOfReviews}
        />
      </section>

      <Space className={reviewsDistributionSection} y={2}>
        <div className={reviewsDistributionWrapper}>
          {reviewsDistribution.map(([score, percentage]) => (
            <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
          ))}
        </div>

        <ReviewsDialog
          Header={
            <PillowHeader
              title={productName}
              score={rating.score}
              reviewsCount={rating.totalOfReviews}
              pillow={pillowImage}
            />
          }
          reviews={reviews}
          reviewsDistribution={reviewsDistribution}
          selectedScore={selectedScore}
          onSelectedScoreChange={setSelectedScore}
        >
          <Button variant="primary-alt" size="medium">
            {t('VIEW_REVIEWS_LABEL')}
          </Button>
        </ReviewsDialog>
      </Space>
    </div>
  )
}
