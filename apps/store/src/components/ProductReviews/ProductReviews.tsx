import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Space, theme } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { TrustpilotWidget } from '@/features/memberReviews/TruspilotWidget'
import { AverageRating } from './AverageRating'
import { ReviewsDialog } from './ReviewsDialog'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { ReviewTabs, TABS } from './ReviewTabs'
import { useReviews } from './useReviews'

export const ProductReviews = () => {
  const { t } = useTranslation('common')
  const {
    rating,
    reviews,
    reviewsDistribution,
    selectedTab,
    setSelectedTab,
    setSelectedScore,
    selectedScore,
  } = useReviews()

  if (!rating) {
    console.warn('ProductReviews | No rating data available')
    return null
  }

  const tooltipText =
    selectedTab === TABS.PRODUCT
      ? t('PRODUCT_REVIEWS_DISCLAIMER')
      : t('TRUSTPILOT_REVIEWS_DISCLAIMER')

  return (
    <Wrapper y={3.5}>
      <AverageRating
        score={rating.score}
        maxScore={MAX_SCORE}
        reviewsCount={rating.totalOfReviews}
        explanation={tooltipText}
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
          tooltipText={tooltipText}
        >
          <Button variant="ghost">{t('VIEW_REVIEWS_LABEL')}</Button>
        </ReviewsDialog>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  width: 'min(30.5rem, 100%)',
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
