import { useTranslation } from 'next-i18next'
import { Button } from 'ui'
import { AverageRatingV2 } from '@/components/ProductReviews/AverageRatingV2'
import { ReviewsDiclaimer } from '@/components/ProductReviews/ReviewsDisclaimer'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { wrapper, averageRatingLabel, disclaimerLabel } from './AverageRatingBanner.css'

export const AverageRatingBanner = () => {
  const { t } = useTranslation('reviews')

  return (
    <div className={wrapper}>
      <div>
        {/* TODO: get average rating from vercel kv */}
        <AverageRatingV2 className={averageRatingLabel} score={4.1} maxScore={MAX_SCORE} />
        {/* TODO: get reviews count from vercel kv */}
        <ReviewsDiclaimer
          className={disclaimerLabel}
          size={{ _: 'xs', sm: 'md' }}
          reviewsCount={4748}
        />
      </div>

      {/* TODO: get latest reviews from vercel kv and display ReviewsDialogV2 */}
      <Button variant="primary" size="medium">
        {t('VIEW_REVIEWS_LABEL')}
      </Button>
    </div>
  )
}

AverageRatingBanner.blockName = 'averageRatingBanner'
