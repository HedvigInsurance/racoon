import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { AverageRating } from '@/components/ProductReviews/AverageRating'
import { PillowHeader } from '@/components/ProductReviews/PillowHeader'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { ReviewsDiclaimer } from '@/components/ProductReviews/ReviewsDisclaimer'
import { useReviews } from '@/components/ProductReviews/useReviews'
import { useCompanyReviewsDataContext } from '@/features/memberReviews/CompanyReviewsDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { wrapper, averageRatingLabel, disclaimerLabel, trigger } from './AverageRatingBanner.css'

const HEDVIG_PILLOW_URL =
  'https://a.storyblok.com/f/165473/450x450/4b792f1052/hedvig-pillows-icon.png'

export const AverageRatingBanner = () => {
  const { t } = useTranslation('reviews')

  const companyReviewsData = useCompanyReviewsDataContext()
  const { rating, reviews, reviewsDistribution, selectedScore, setSelectedScore } =
    useReviews(companyReviewsData)

  if (!rating) {
    console.log('AverageRatingBanner | No rating data available')
    return null
  }

  return (
    <div className={wrapper}>
      <div>
        <AverageRating className={averageRatingLabel} score={rating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer
          className={disclaimerLabel}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={rating.totalOfReviews}
        />
      </div>

      <ReviewsDialog
        Header={
          <PillowHeader
            title="Hedvig"
            score={rating.score}
            reviewsCount={rating.totalOfReviews}
            pillow={{
              src: HEDVIG_PILLOW_URL,
            }}
          />
        }
        reviews={reviews}
        reviewsDistribution={reviewsDistribution}
        selectedScore={selectedScore}
        onSelectedScoreChange={setSelectedScore}
      >
        <Button className={trigger} variant="primary" size="medium">
          {t('VIEW_REVIEWS_LABEL')}
        </Button>
      </ReviewsDialog>
    </div>
  )
}

AverageRatingBanner.blockName = 'averageRatingBanner'
