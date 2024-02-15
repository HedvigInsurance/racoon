import { useTranslation } from 'next-i18next'
import { Space, Button } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { AverageRating } from './AverageRating'
import { wrapper } from './ProductReviews.css'
import { ReviewsDialog } from './ReviewsDialog'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { useReviews } from './useReviews'

export const ProductReviews = () => {
  const { t } = useTranslation('reviews')
  const { rating, reviews, reviewsDistribution, setSelectedScore, selectedScore } = useReviews()

  if (!rating) {
    console.warn('ProductReviews | No rating data available')
    return null
  }

  return (
    <Space className={wrapper} y={1.5}>
      <section>
        <AverageRating score={rating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer reviewsCount={rating.totalOfReviews} />
      </section>

      <Space y={1}>
        {reviewsDistribution.map(([score, percentage]) => (
          <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
        ))}

        <ReviewsDialog
          reviews={reviews}
          rating={rating}
          reviewsDistribution={reviewsDistribution}
          selectedScore={selectedScore}
          onSelectedScoreChange={setSelectedScore}
        >
          <Button variant="ghost">{t('VIEW_REVIEWS_LABEL')}</Button>
        </ReviewsDialog>
      </Space>
    </Space>
  )
}
