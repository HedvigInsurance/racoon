import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Dialog, Button, Space, CrossIcon, theme, mq } from 'ui'
import { getReviewsDistribution } from '@/services/productReviews/getReviewsDistribution'
import { MAX_SCORE } from '@/services/productReviews/productReviews.constants'
import type {
  Score,
  ReviewsDistribution,
  Review as ProductReview,
} from '@/services/productReviews/productReviews.types'
import { TrustpilotWidget } from '@/services/trustpilot/TruspilotWidget'
import { useTrustpilotData } from '@/services/trustpilot/trustpilot'
import { type Review as CompanyReview } from '@/services/trustpilot/trustpilot.types'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { Rating } from './Rating'
import { ReviewComment, type Review } from './ReviewComment'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { ReviewsFilter } from './ReviewsFilter'
import { ReviewTabs, TABS, type Tab } from './ReviewTabs'

type Props = {
  tooltipText?: string
}

export const ProductReviews = (props: Props) => {
  const { t } = useTranslation('common')

  const getReviewsData = useGetReviewsData()

  const [selectedScore, setSelectedScore] = useState<Score>(5)
  const [selectedTab, setSelectedTab] = useState<Tab>(TABS.PRODUCT)

  const reviewsData = getReviewsData(selectedTab, selectedScore)
  if (!reviewsData) {
    console.warn('[ProductReviews]: No review data available. Skip rendering.')
    return null
  }
  const { rating, comments, reviewsDistribution } = reviewsData

  return (
    <Wrapper y={3.5}>
      <Rating
        score={Number(rating.score)}
        maxScore={MAX_SCORE}
        reviewsCount={rating.totalOfReviews}
        explanation={props.tooltipText}
      />

      <Space y={1}>
        <ReviewTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

        {selectedTab === TABS.PRODUCT && (
          <div>
            {reviewsDistribution.map(([score, percentage]) => (
              <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
            ))}
          </div>
        )}
        {selectedTab === TABS.TRUSTPILOT && (
          <StyledTrustpilotWidget variant="mini" data-style-height="112px" />
        )}

        <Dialog.Root>
          <Dialog.Trigger asChild>
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
                  score={rating.score}
                  maxScore={MAX_SCORE}
                  reviewsCount={rating.totalOfReviews}
                  explanation={props.tooltipText}
                />

                <Space y={1}>
                  <ReviewTabs selectedTab={selectedTab} onTabChange={setSelectedTab} />

                  {selectedTab === TABS.PRODUCT && (
                    <ReviewsFilter
                      reviewsDistribution={reviewsDistribution}
                      selectedScore={selectedScore}
                      onSelectedScoreChange={setSelectedScore}
                    />
                  )}

                  <CommentsList y={{ base: 0.5, md: 1 }}>
                    {comments.map((comment) => (
                      <Comment key={comment.id} {...comment} />
                    ))}
                  </CommentsList>
                </Space>
              </Space>
            </DialogWindow>
          </DialogContent>
        </Dialog.Root>
      </Space>
    </Wrapper>
  )
}

const useGetReviewsData = () => {
  const { averageRating, reviewComments } = useProductPageContext()
  const trustpilotData = useTrustpilotData()

  const getReviewsData = (selectedTab: Tab, selectedScore: Score) => {
    if (!averageRating && !reviewComments && !trustpilotData) {
      return null
    }

    const rating = { score: 0, totalOfReviews: 0 }
    if (selectedTab === TABS.PRODUCT && averageRating) {
      rating.score = averageRating.score
      rating.totalOfReviews = averageRating.reviewCount
    } else if (selectedTab === TABS.TRUSTPILOT && trustpilotData) {
      rating.score = trustpilotData.score
      rating.totalOfReviews = trustpilotData.totalReviews
    }

    let comments: Array<Review> = []
    if (selectedTab === TABS.PRODUCT && reviewComments) {
      comments = parseProductReviews(reviewComments.commentsByScore[selectedScore].latestComments)
    } else if (selectedTab === TABS.TRUSTPILOT && trustpilotData?.reviews) {
      comments = parseCompanyReviews(trustpilotData.reviews)
    }

    let reviewsDistribution: ReviewsDistribution = []
    if (selectedTab === TABS.PRODUCT && reviewComments) {
      reviewsDistribution = getReviewsDistribution(reviewComments)
    }

    return {
      rating,
      comments,
      reviewsDistribution,
    }
  }

  return getReviewsData
}

const parseProductReviews = (productReviews: Array<ProductReview>): Array<Review> => {
  return productReviews.map((productReview) => ({
    id: productReview.id,
    type: 'product',
    score: productReview.score,
    date: productReview.date,
    content: productReview.content,
  }))
}

const parseCompanyReviews = (companyReviews: Array<CompanyReview>): Array<Review> => {
  return companyReviews.map((companyReview) => ({
    id: companyReview.id,
    type: 'company',
    score: companyReview.stars,
    date: companyReview.createdAt,
    content: companyReview.text,
  }))
}

const Wrapper = styled(Space)({
  width: 'min(28.5rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
})

const StyledTrustpilotWidget = styled(TrustpilotWidget)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.space.lg,
  // Optical alignment so widget gets horizontally centered
  paddingLeft: '2.5rem',
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
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
