'use client'
import { useTranslation } from 'next-i18next'
import { Button } from 'ui/src/components/Button/Button'
import { AverageRating } from '@/components/ProductReviews/AverageRating'
import { PillowHeader } from '@/components/ProductReviews/PillowHeader'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { ReviewsDiclaimer } from '@/components/ProductReviews/ReviewsDisclaimer'
import { useCompanyReviewsMetadata } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { wrapper, averageRatingLabel, disclaimerLabel, trigger } from './AverageRatingBanner.css'

const HEDVIG_PILLOW_URL =
  'https://a.storyblok.com/f/165473/450x450/4b792f1052/hedvig-pillows-icon.png'

export const AverageRatingBannerBlock = () => {
  const { t } = useTranslation('reviews')

  const companyReviewsMetadata = useCompanyReviewsMetadata()
  if (!companyReviewsMetadata) {
    console.log('AverageRatingBanner | No company reviews metadata available')
    return null
  }

  const { averageRating, reviewsDistribution } = companyReviewsMetadata

  return (
    <div className={wrapper}>
      <div>
        <AverageRating
          className={averageRatingLabel}
          score={averageRating.score}
          maxScore={MAX_SCORE}
        />
        <ReviewsDiclaimer
          className={disclaimerLabel}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={averageRating.totalOfReviews}
        />
      </div>

      <ReviewsDialog
        Header={
          <PillowHeader
            title="Hedvig"
            score={averageRating.score}
            reviewsCount={averageRating.totalOfReviews}
            pillow={{
              src: HEDVIG_PILLOW_URL,
            }}
          />
        }
        reviewsDistribution={reviewsDistribution}
      >
        <Button className={trigger} variant="primary" size="medium">
          {t('VIEW_REVIEWS_LABEL')}
        </Button>
      </ReviewsDialog>
    </div>
  )
}
