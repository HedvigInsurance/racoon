import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Dialog, Button, Space, CrossIcon, theme, mq } from 'ui'
import { MAX_SCORE } from '@/services/productReviews/productReviews.constants'
import type { Score, ReviewsDistribution } from '@/services/productReviews/productReviews.types'
import { Rating } from './Rating'
import { ReviewComment, type Review } from './ReviewComment'
import { ReviewsFilter } from './ReviewsFilter'
import { ReviewTabs, TABS, type Tab } from './ReviewTabs'

type Rating = {
  score: number
  totalOfReviews: number
}

type Props = {
  reviews: Array<Review>
  rating: Rating
  reviewsDistribution: ReviewsDistribution
  selectedTab: Tab
  onSelectedTabChange: (tab: Tab) => void
  selectedScore: Score
  onSelectedScoreChange: (score: Score) => void
  tooltipText?: string
}

export const ReviewsDialog = ({
  reviews,
  rating,
  reviewsDistribution,
  selectedTab,
  onSelectedTabChange,
  selectedScore,
  onSelectedScoreChange,
  tooltipText,
}: Props) => {
  const { t } = useTranslation('common')

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={true}>
        <Button variant="ghost">{t('VIEW_REVIEWS_LABEL')}</Button>
      </Dialog.Trigger>

      <DialogContent centerContent={true}>
        <DialogWindow>
          <Dialog.Close asChild={true}>
            <CloseButton>
              <CrossIcon size={'1.5rem'} />
            </CloseButton>
          </Dialog.Close>

          <Space y={3.5}>
            <Rating
              score={Number(rating.score)}
              maxScore={MAX_SCORE}
              reviewsCount={rating.totalOfReviews}
              explanation={tooltipText}
            />

            <Space y={1}>
              <ReviewTabs selectedTab={selectedTab} onTabChange={onSelectedTabChange} />

              {selectedTab === TABS.PRODUCT && (
                <ReviewsFilter
                  reviewsDistribution={reviewsDistribution}
                  selectedScore={selectedScore}
                  onSelectedScoreChange={onSelectedScoreChange}
                />
              )}

              <Reviews y={{ base: 0.5, md: 1 }}>
                {reviews.map((review) => (
                  <Review key={review.id} {...review} />
                ))}
              </Reviews>
            </Space>
          </Space>
        </DialogWindow>
      </DialogContent>
    </Dialog.Root>
  )
}

const CloseButton = styled.button({
  position: 'absolute',
  top: theme.space.md,
  right: theme.space.md,
  borderRadius: '50%',
  padding: theme.space.xs,
  cursor: 'pointer',

  [mq.md]: {
    top: theme.space.lg,
    right: theme.space.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.opaque1,
    },
  },
})

const DialogWindow = styled(Dialog.Window)({
  position: 'relative',
  borderRadius: theme.radius.lg,
  paddingInline: theme.space.md,
  paddingBlock: theme.space.xxxl,
  overflowY: 'auto',

  [mq.md]: {
    padding: theme.space.xxxl,
  },
})

const DialogContent = styled(Dialog.Content)({
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: `calc(100% - ${theme.space.md} * 2)`,
  maxWidth: '28.5rem',
  maxHeight: `calc(100% - ${theme.space.md} * 2)`,

  [mq.md]: {
    width: `calc(100% - ${theme.space.md} * 2)`,
    maxWidth: '36rem',
    maxHeight: `calc(100% - ${theme.space.xxxl} * 2)`,
  },
})

const Reviews = styled(Space)({
  marginBottom: `-${theme.space.xxxl}`,
  overflowY: 'auto',
})

const Review = styled(ReviewComment)({
  width: '100%',

  ':last-of-type': {
    marginBottom: theme.space.md,
  },

  [mq.md]: {
    ':last-of-type': {
      marginBottom: theme.space.xxl,
    },
  },
})
