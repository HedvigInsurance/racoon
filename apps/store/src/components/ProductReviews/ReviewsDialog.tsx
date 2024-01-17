import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Dialog, Text, Space, CrossIcon, theme, mq } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import type { Score } from '@/features/memberReviews/memberReviews.types'
import type {
  Review,
  Rating,
  ReviewsDistribution,
} from '@/features/memberReviews/memberReviews.types'
import { AverageRating } from './AverageRating'
import { ReviewComment } from './ReviewComment'
import { ReviewsFilter } from './ReviewsFilter'
import { ReviewTabs, TABS, type Tab } from './ReviewTabs'

type Props = {
  children: ReactNode
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
  children,
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
      <Dialog.Trigger asChild={true}>{children}</Dialog.Trigger>

      <DialogContent centerContent={true} frostedOverlay={true}>
        <Dialog.Close asChild={true}>
          <CloseButton>
            <CrossIcon size={'1rem'} />
          </CloseButton>
        </Dialog.Close>

        <DialogWindow>
          <Space y={3.5}>
            <AverageRating
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

              {reviews.length > 0 ? (
                <Reviews y={{ base: 0.5, md: 1 }}>
                  {reviews.map((review) => (
                    <Review key={review.id} {...review} />
                  ))}
                  <LatestReviewsWithCommentsLabel align="center" color="textSecondary">
                    {t('LATEST_REVIEWS_WITH_COMMENTS_LABEL')}
                  </LatestReviewsWithCommentsLabel>
                </Reviews>
              ) : (
                <NoReviewsLabel align="center" color="textSecondary">
                  {t('NO_REVIEWS_LABEL')}
                </NoReviewsLabel>
              )}
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
  backgroundColor: theme.colors.translucent1,
  backdropFilter: 'blur(30px)',
  cursor: 'pointer',
  zIndex: 1,

  [mq.md]: {
    top: theme.space.lg,
    right: theme.space.lg,
  },

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.translucent2,
    },
  },
})

const DialogWindow = styled(Dialog.Window)({
  '--scrollbar-thumb-color': theme.colors.gray500,
  '--scrollbar-thumb-color-hover': theme.colors.gray600,
  '--scrollbar-track-width': '8px',

  paddingInline: theme.space.md,
  paddingBlock: theme.space.xxxl,
  overflowY: 'auto',

  // Scrollbar styles
  [mq.sm]: {
    // Firefox
    scrollbarColor: 'var(--scrollbar-thumb-color)',
    scrollbarWidth: 'thin',

    // Webkit based browsers
    '::-webkit-scrollbar': {
      width: 'var(--scrollbar-track-width)',
      height: 'var(--scrollbar-track-width)',
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '1000px',
      backgroundColor: 'var(--scrollbar-thumb-color)',
    },
    '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'var(--scrollbar-thumb-color-hover)',
    },
  },

  [mq.md]: {
    padding: theme.space.xxxl,
  },
})

const DialogContent = styled(Dialog.Content)({
  position: 'relative',
  alignSelf: 'center',
  display: 'flex',
  flexDirection: 'column',
  width: `min(35.5rem, calc(100% - ${theme.space.md} * 2))`,
  maxHeight: `calc(100% - ${theme.space.md} * 2)`,
  border: `1px solid ${theme.colors.borderTranslucent1}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colors.backgroundStandard,
  boxShadow: theme.shadow.default,
  isolation: 'isolate',
  overflow: 'hidden',

  [mq.md]: {
    maxHeight: `calc(100% - ${theme.space.xxxl} * 2)`,
  },
})

const Reviews = styled(Space)({
  marginBottom: `-${theme.space.xxxl}`,
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

const LatestReviewsWithCommentsLabel = styled(Text)({
  marginBottom: theme.space.md,
  padding: theme.space.md,

  [mq.md]: {
    marginBottom: theme.space.xl,
  },
})

const NoReviewsLabel = styled(Text)({
  padding: theme.space.md,
})
