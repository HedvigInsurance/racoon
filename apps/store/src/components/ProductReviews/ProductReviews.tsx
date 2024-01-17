import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, Space, theme } from 'ui'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { TrustpilotWidget } from '@/features/memberReviews/TruspilotWidget'
import { AverageRating } from './AverageRating'
import { ReviewsDialog } from './ReviewsDialog'
import { ReviewsDistributionByScore } from './ReviewsDistributionByScore'
import { ReviewTabs, TABS, type Tab } from './ReviewTabs'
import { useReviews } from './useReviews'

type Props = {
  defaultActiveTab?: Tab
}

export const ProductReviews = (props: Props) => {
  const { t } = useTranslation('common')

  const {
    rating,
    reviews,
    reviewsDistribution,
    selectedTab,
    setSelectedTab,
    setSelectedScore,
    selectedScore,
  } = useReviews(getInitialSelectedTab(props.defaultActiveTab))

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
          <DistributionByScoreWrapper>
            {reviewsDistribution.map(([score, percentage]) => (
              <ReviewsDistributionByScore key={score} score={score} percentage={percentage} />
            ))}
          </DistributionByScoreWrapper>
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

const TAB_CONTENT_HEIGHT = '17.18rem' // 275px

const Wrapper = styled(Space)({
  width: 'min(30.5rem, 100%)',
  marginInline: 'auto',
  paddingInline: theme.space.md,
})

const DistributionByScoreWrapper = styled.div({
  height: TAB_CONTENT_HEIGHT,
})

const StyledTrustpilotWidget = styled(TrustpilotWidget)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: TAB_CONTENT_HEIGHT,
  padding: theme.space.lg,
  // Optical alignment so widget gets horizontally centered
  paddingLeft: '2.5rem',
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
})

const getInitialSelectedTab = (defaultActiveTab?: Tab) => {
  if (!defaultActiveTab) return TABS.PRODUCT

  const isValidTab = Object.values(TABS).includes(defaultActiveTab)
  if (isValidTab) {
    return defaultActiveTab
  } else {
    console.warn(`ProductReviews | Invalid default tab ${defaultActiveTab}. Defaulting to product`)
    return TABS.PRODUCT
  }
}
