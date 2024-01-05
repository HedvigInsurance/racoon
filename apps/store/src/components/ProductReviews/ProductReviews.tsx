import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Space, theme } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import type {
  Score,
  Review,
  ReviewsDistribution,
} from '@/features/memberReviews/memberReviews.types'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { TrustpilotWidget } from '@/features/memberReviews/TruspilotWidget'
import { useTrustpilotData } from '@/features/memberReviews/TrustpilotDataProvider'
import { AverageRating } from './AverageRating'
import { ReviewsDialog } from './ReviewsDialog'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { ReviewTabs, TABS, type Tab } from './ReviewTabs'

type Props = {
  tooltipText?: string
}

export const ProductReviews = (props: Props) => {
  const getReviewsData = useGetReviewsData()

  const [selectedScore, setSelectedScore] = useState<Score>(5)
  const [selectedTab, setSelectedTab] = useState<Tab>(TABS.PRODUCT)

  const reviewsData = getReviewsData(selectedTab, selectedScore)
  if (!reviewsData) {
    console.warn('[ProductReviews]: No review data available. Skip rendering.')
    return null
  }
  const { rating, reviewsDistribution, reviews } = reviewsData

  return (
    <Wrapper y={3.5}>
      <AverageRating
        score={rating.score}
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

        <ReviewsDialog
          reviews={reviews}
          rating={rating}
          reviewsDistribution={reviewsDistribution}
          selectedTab={selectedTab}
          onSelectedTabChange={setSelectedTab}
          selectedScore={selectedScore}
          onSelectedScoreChange={setSelectedScore}
          tooltipText={props.tooltipText}
        />
      </Space>
    </Wrapper>
  )
}

const useGetReviewsData = () => {
  const productReviewsData = useProuctReviewsDataContext()
  const trustpilotData = useTrustpilotData()

  const getReviewsData = (selectedTab: Tab, selectedScore: Score) => {
    if (!productReviewsData && !trustpilotData) {
      return null
    }

    const rating = { score: 0, totalOfReviews: 0 }
    if (selectedTab === TABS.PRODUCT && productReviewsData?.averageRating) {
      rating.score = productReviewsData.averageRating.score
      rating.totalOfReviews = productReviewsData.averageRating.totalOfReviews
    } else if (selectedTab === TABS.TRUSTPILOT && trustpilotData) {
      rating.score = trustpilotData.averageRating.score
      rating.totalOfReviews = trustpilotData.averageRating.totalOfReviews
    }

    let reviews: Array<Review> = []
    if (selectedTab === TABS.PRODUCT && productReviewsData?.reviewsByScore) {
      reviews = productReviewsData.reviewsByScore[selectedScore].reviews
    } else if (selectedTab === TABS.TRUSTPILOT && trustpilotData) {
      reviews = trustpilotData.reviews
    }

    let reviewsDistribution: ReviewsDistribution = []
    if (selectedTab === TABS.PRODUCT && productReviewsData?.reviewsDistribution) {
      reviewsDistribution = productReviewsData.reviewsDistribution
    }

    return {
      rating,
      reviews,
      reviewsDistribution,
    }
  }

  return getReviewsData
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
