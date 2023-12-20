import styled from '@emotion/styled'
import { useState, useMemo } from 'react'
import { Dialog, Button, Space, CrossIcon, theme, mq } from 'ui'
import { getReviewsDistribution } from '@/services/productReviews/getReviewsDistribution'
import { MAX_SCORE } from '@/services/productReviews/productReviews.constants'
import type { Score } from '@/services/productReviews/productReviews.types'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { Rating } from './Rating'
import { ReviewComment } from './ReviewComment'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { ReviewsFilter } from './ReviewsFilter'

type Props = {
  tooltipText?: string
}

export const ProductReviews = (props: Props) => {
  const { averageRating, reviewComments } = useProductPageContext()
  const [selectedScore, setSelectedScore] = useState<Score>('5')

  const reviewsDistribution = useMemo(() => {
    if (!reviewComments) {
      return []
    }

    return getReviewsDistribution(reviewComments)
  }, [reviewComments])

  if (!averageRating || !reviewComments) {
    // We already log the absence of 'averageRating'/'reviewComments' during build time
    return null
  }

  const comments = reviewComments.commentsByScore[selectedScore].latestComments

  return (
    <Wrapper y={3.5}>
      <Rating
        score={averageRating.score}
        maxScore={MAX_SCORE}
        reviewsCount={averageRating.reviewCount}
        explanation={props.tooltipText}
      />

      <div>
        <div>
          {reviewsDistribution.map(([score, percentage]) => (
            <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
          ))}
        </div>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="ghost">Visa omdömen</Button>
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
                  score={averageRating.score}
                  maxScore={MAX_SCORE}
                  reviewsCount={averageRating.reviewCount}
                  explanation={props.tooltipText}
                />

                <Space y={1}>
                  <ReviewsFilter
                    reviewsDistribution={reviewsDistribution}
                    selectedScore={selectedScore}
                    onSelectedScoreChange={setSelectedScore}
                  />

                  <CommentsList y={{ base: 0.5, md: 1 }}>
                    {comments.map((comment) => (
                      <Comment
                        key={`${comment.score}-${comment.date}`}
                        score={comment.score}
                        date={comment.date}
                        content={comment.content}
                      />
                    ))}
                  </CommentsList>
                </Space>
              </Space>
            </DialogWindow>
          </DialogContent>
        </Dialog.Root>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  width: 'min(28.5rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
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

const CommentsList = styled(Space)({
  marginBottom: `-${theme.space.xxxl}`,
  overflowY: 'auto',
})

const Comment = styled(ReviewComment)({
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
