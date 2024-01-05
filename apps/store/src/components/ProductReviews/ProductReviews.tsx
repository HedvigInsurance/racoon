import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Space, theme } from 'ui'
import { TrustpilotWidget } from '@/features/memberReviews/TruspilotWidget'
import { type Review as CompanyReview } from '@/features/memberReviews/trustpilot.types'
import { useTrustpilotData } from '@/features/memberReviews/TrustpilotDataProvider'
import { getReviewsDistribution } from '@/services/productReviews/getReviewsDistribution'
import { MAX_SCORE } from '@/services/productReviews/productReviews.constants'
import type { Review as ProductReview } from '@/services/productReviews/productReviews.types'
import { useProductPageContext } from '../ProductPage/ProductPageContext'
import { AverageRating } from './AverageRating'
import type { Score, Review, ReviewsDistribution } from './ProductReviews.types'
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

    let reviews: Array<Review> = []
    if (selectedTab === TABS.PRODUCT && reviewComments) {
      reviews = parseProductReviews(reviewComments.commentsByScore[selectedScore].latestComments)
    } else if (selectedTab === TABS.TRUSTPILOT && trustpilotData) {
      reviews = parseCompanyReviews(trustpilotData.reviews)
    }

    let reviewsDistribution: ReviewsDistribution = []
    if (selectedTab === TABS.PRODUCT && reviewComments) {
      reviewsDistribution = getReviewsDistribution(reviewComments)
    }

    return {
      rating,
      reviews,
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
