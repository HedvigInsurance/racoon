import { useTranslation } from 'next-i18next'
import { type ReactElement, type ReactNode } from 'react'
import { Dialog, Text, Space, CrossIcon } from 'ui'
import type { Score } from '@/features/memberReviews/memberReviews.types'
import type { Review, ReviewsDistribution } from '@/features/memberReviews/memberReviews.types'
import { ReviewComment } from './ReviewComment'
import {
  closeBtn,
  dialogContent,
  dialogWindow,
  reviewComment,
  latestReviewsLabel,
  noReviewsLabel,
} from './ReviewsDialog.css'
import { ReviewsFilter } from './ReviewsFilter'

type Props = {
  children: ReactNode
  reviews: Array<Review>
  reviewsDistribution: ReviewsDistribution
  selectedScore: Score
  onSelectedScoreChange: (score: Score) => void
  Header?: ReactElement
  onClose?: () => void
}

export const ReviewsDialog = ({
  children,
  reviews,
  reviewsDistribution,
  selectedScore,
  onSelectedScoreChange,
  Header,
  onClose,
}: Props) => {
  const { t } = useTranslation('reviews')

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>

      <Dialog.Content className={dialogContent} centerContent={true} onClose={onClose}>
        <Dialog.Close className={closeBtn} onClick={onClose}>
          <CrossIcon size={'1rem'} />
        </Dialog.Close>

        <Dialog.Window className={dialogWindow}>
          <Space y={2}>
            {Header}

            <Space y={1}>
              <ReviewsFilter
                reviewsDistribution={reviewsDistribution}
                selectedScore={selectedScore}
                onSelectedScoreChange={onSelectedScoreChange}
              />

              {reviews.length > 0 ? (
                <Space y={{ base: 0.5, md: 1 }}>
                  {reviews.map((review) => (
                    <ReviewComment key={review.id} className={reviewComment} {...review} />
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
