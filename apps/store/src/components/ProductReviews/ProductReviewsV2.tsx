import { useTranslation } from 'next-i18next'
import { Space, Button } from 'ui'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { AverageRatingV2 } from './AverageRatingV2'
import { PillowHeader } from './PillowHeader'
import { wrapper, innerWrapper } from './ProductReviewsV2.css'
import { ReviewsDialogV2 } from './ReviewsDialogV2'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { useReviewsV2 } from './useReviewsV2'

export const ProductReviewsV2 = () => {
  const { t } = useTranslation('reviews')

  const { displayNameShort: productName, pillowImage } = useProductData()
  const productReviewsData = useProuctReviewsDataContext()
  const { rating, reviews, reviewsDistribution, setSelectedScore, selectedScore } =
    useReviewsV2(productReviewsData)

  if (!rating) {
    console.warn('ProductReviews | No rating data available')
    return null
  }

  return (
    <Space className={wrapper} y={1.5}>
      <section>
        <AverageRatingV2 score={rating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer reviewsCount={rating.totalOfReviews} />
      </section>

      <Space className={innerWrapper} y={{ base: 0, md: 1 }}>
        {reviewsDistribution.map(([score, percentage]) => (
          <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
        ))}

        <ReviewsDialogV2
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
        </ReviewsDialogV2>
      </Space>
    </Space>
  )
}
