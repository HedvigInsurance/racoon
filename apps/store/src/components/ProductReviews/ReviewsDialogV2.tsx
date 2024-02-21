import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Dialog, Text, Space, CrossIcon } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import type { Score } from '@/features/memberReviews/memberReviews.types'
import type {
  Review,
  Rating,
  ReviewsDistribution,
} from '@/features/memberReviews/memberReviews.types'
import { AverageRatingV2 } from './AverageRatingV2'
import { ReviewCommentV2 } from './ReviewCommentV2'
import {
  closeBtn,
  dialogContent,
  dialogWindow,
  reviewComment,
  latestReviewsLabel,
  noReviewsLabel,
} from './ReviewsDialogV2.css'
import { ReviewsDiclaimer } from './ReviewsDisclaimer'
import { ReviewsFilter } from './ReviewsFilter'

type Props = {
  children: ReactNode
  reviews: Array<Review>
  rating: Rating
  reviewsDistribution: ReviewsDistribution
  onClose?: () => void
  selectedScore: Score
  onSelectedScoreChange: (score: Score) => void
}

export const ReviewsDialogV2 = ({
  children,
  reviews,
  rating,
  reviewsDistribution,
  onClose,
  selectedScore,
  onSelectedScoreChange,
}: Props) => {
  const { t } = useTranslation('common')

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>

      <Dialog.Content className={dialogContent} centerContent={true} onClose={onClose}>
        <Dialog.Close className={closeBtn} onClick={onClose}>
          <CrossIcon size={'1rem'} />
        </Dialog.Close>

        <Dialog.Window className={dialogWindow}>
          <Space y={1.5}>
            <section>
              <AverageRatingV2 size={{ _: 9, sm: 11 }} score={rating.score} maxScore={MAX_SCORE} />
              <ReviewsDiclaimer size={{ _: 'xs', sm: 'md' }} reviewsCount={rating.totalOfReviews} />
            </section>

            <Space y={1}>
              <ReviewsFilter
                reviewsDistribution={reviewsDistribution}
                selectedScore={selectedScore}
                onSelectedScoreChange={onSelectedScoreChange}
              />

              {reviews.length > 0 ? (
                <Space y={{ base: 0.5, md: 1 }}>
                  {reviews.map((review) => (
                    <ReviewCommentV2 key={review.id} className={reviewComment} {...review} />
                  ))}

                  <Text
                    className={latestReviewsLabel}
                    size="xs"
                    align="center"
                    color="textSecondary"
                  >
                    {t('LATEST_REVIEWS_WITH_COMMENTS_LABEL')}
                  </Text>
                </Space>
              ) : (
                <Text className={noReviewsLabel} align="center" color="textSecondary">
                  {t('NO_REVIEWS_LABEL')}
                </Text>
              )}
            </Space>
          </Space>
        </Dialog.Window>
      </Dialog.Content>
    </Dialog.Root>
  )
}
