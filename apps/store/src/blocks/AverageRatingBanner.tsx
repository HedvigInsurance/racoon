import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { AverageRatingV2 } from '@/components/ProductReviews/AverageRatingV2'
import { PillowHeader } from '@/components/ProductReviews/PillowHeader'
import { ReviewsDialogV2 } from '@/components/ProductReviews/ReviewsDialogV2'
import { ReviewsDiclaimer } from '@/components/ProductReviews/ReviewsDisclaimer'
import { useReviewsV2 } from '@/components/ProductReviews/useReviewsV2'
import { useCompanyReviewsDataContext } from '@/features/memberReviews/CompanyReviewsDataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { wrapper, averageRatingLabel, disclaimerLabel } from './AverageRatingBanner.css'

const HEDVIG_PILLOW_URL =
  'https://a.storyblok.com/f/165473/850x850/16587635ce/hedvig-pillows-hedvig.png'

export const AverageRatingBanner = () => {
  const { t } = useTranslation('reviews')

  const companyReviewsData = useCompanyReviewsDataContext()
  const { rating, reviews, reviewsDistribution, selectedScore, setSelectedScore } =
    useReviewsV2(companyReviewsData)

  if (!rating) {
    console.log('AverageRatingBanner | No rating data available')
    return null
  }

  return (
    <div className={wrapper}>
      <div>
        <AverageRatingV2 className={averageRatingLabel} score={rating.score} maxScore={MAX_SCORE} />
        <ReviewsDiclaimer
          className={disclaimerLabel}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={rating.totalOfReviews}
        />
      </div>

      <ReviewsDialogV2
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
        <Button variant="primary" size="medium">
          {t('VIEW_REVIEWS_LABEL')}
        </Button>
      </ReviewsDialogV2>
    </div>
  )
}

AverageRatingBanner.blockName = 'averageRatingBanner'
