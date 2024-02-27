import { useTranslation } from 'next-i18next'
import { useState, type ReactElement, type ReactNode } from 'react'
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
  reviewsDistribution: ReviewsDistribution
  Header?: ReactElement
  onClose?: () => void
}

export const ReviewsDialog = ({ children, reviewsDistribution, Header, onClose }: Props) => {
  const { t } = useTranslation('reviews')

  const { reviews, selectedScore, setSelectedScore } = useReviewsDialog()

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

            <Space y={2}>
              <ReviewsFilter
                reviewsDistribution={reviewsDistribution}
                selectedScore={selectedScore}
                onSelectedScoreChange={setSelectedScore}
              />

              {reviews.length > 0 ? (
                <>
                  <Text
                    className={latestReviewsLabel}
                    size={{ _: 'xs', sm: 'md' }}
                    align="center"
                    color="textSecondary"
                  >
                    {t('LATEST_REVIEWS_WITH_COMMENTS_LABEL')}
                  </Text>

                  <Space y={{ base: 0.5, md: 1 }}>
                    {reviews.map((review) => (
                      <ReviewComment key={review.id} className={reviewComment} {...review} />
                    ))}
                  </Space>
                </>
              ) : (
                <Text
                  className={noReviewsLabel}
                  size={{ _: 'xs', sm: 'md' }}
                  align="center"
                  color="textSecondary"
                >
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

// TODO: Implement client side reviews fetching and additional state management
const useReviewsDialog = () => {
  const [selectedScore, setSelectedScore] = useState<Score>(5)
  const [reviews] = useState<Array<Review>>([])

  return {
    reviews,
    selectedScore,
    setSelectedScore,
  }
}
