import styled from '@emotion/styled'
import { Dialog, Button, Space, CrossIcon, theme, mq } from 'ui'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { Rating } from './Rating'
import { ReviewComment } from './ReviewComment'
import { ReviewsDistribution } from './ReviewsDistribution'

const MAX_SCORE = 5

type Props = {
  calculationExplanation?: string
}

export const ProductReviews = (props: Props) => {
  const { averageRating, reviewComments } = useProductPageContext()

  if (!averageRating || !reviewComments) {
    // We already log the absence of 'averageRating'/'reviewComments' during build time
    return null
  }

  return (
    <Wrapper y={3.5}>
      <Rating
        score={averageRating.score}
        maxScore={MAX_SCORE}
        reviewsCount={averageRating.reviewCount}
        explanation={props.calculationExplanation}
      />

      <div>
        <ReviewsDistribution reviews={reviewComments} />

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
                  explanation={props.calculationExplanation}
                />

                <Space y={1}>
                  <ReviewsDistribution reviews={reviewComments} />

                  <CommentsList y={{ base: 0.5, md: 1 }}>
                    {reviewComments.commentsByScore['5'].latestComments.map((review) => (
                      <Comment
                        key={`${review.score}-${review.date}`}
                        score={review.score}
                        date={review.date}
                        content={review.content}
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
