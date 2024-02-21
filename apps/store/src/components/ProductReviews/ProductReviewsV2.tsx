import { useTranslation } from 'next-i18next'
import { Space, Text, Button } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useFormatter } from '@/utils/useFormatter'
import { AverageRatingV2 } from './AverageRatingV2'
import { wrapper, innerWrapper, dialogHeader } from './ProductReviewsV2.css'
import { ReviewsDialogV2 } from './ReviewsDialogV2'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { useReviewsV2 } from './useReviewsV2'

export const ProductReviewsV2 = () => {
  const { t } = useTranslation('reviews')

  const { displayNameShort: productName, pillowImage } = useProductData()
  const { rating, reviews, reviewsDistribution, setSelectedScore, selectedScore } = useReviewsV2()
  const { numberGrouping } = useFormatter()

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
            <section className={dialogHeader}>
              <Pillow size="xlarge" {...pillowImage} />

              <div>
                <Text align="center">{productName}</Text>
                <Text align="center" color="textSecondary">
                  {t('RATING_SCORE_LABEL', { score: rating.score, maxScore: MAX_SCORE })}
                  {' · '}
                  {t('REVIEWS_COUNT_LABEL', {
                    count: rating.totalOfReviews,
                    reviewsCount: numberGrouping(rating.totalOfReviews),
                  })}
                </Text>
              </div>
            </section>
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
