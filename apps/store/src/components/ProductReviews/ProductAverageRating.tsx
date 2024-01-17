import styled from '@emotion/styled'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { type ReactNode } from 'react'
import { Text, StarIcon, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { useReviews } from '@/components/ProductReviews/useReviews'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'
import { useFormatter } from '@/utils/useFormatter'

export const ProductAverageRating = () => {
  const { t } = useTranslation('common')
  const { numberGrouping } = useFormatter()
  const productReviewsData = useProuctReviewsDataContext()
  const productData = useProductData()

  if (!productReviewsData) {
    console.warn(`ProductAverageRating | Average rating for product ${productData.name} not found`)
    return null
  }
  const { averageRating } = productReviewsData

  return (
    <>
      <Head>
        <script
          key="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getProductStructuredData(productData, averageRating)),
          }}
        />
      </Head>

      <GridLayout.Root>
        <GridLayout.Content
          width={{
            base: '1',
          }}
        >
          <Wrapper>
            <StarIcon size="1rem" />

            <SpaceFlex direction="horizontal" space={0.2} align="center">
              <Text as="span" color="textSecondary" size={{ _: 'xs' }}>
                {t('RATING_SCORE_LABEL', { score: averageRating.score, maxScore: MAX_SCORE })}
              </Text>

              <Text as="span" color="textSecondary" size={{ _: 'xs' }}>
                ·
              </Text>

              <Dialog>
                <Trigger>
                  {t('REVIEWS_COUNT_LABEL', {
                    count: averageRating.totalOfReviews,
                    reviewsCount: numberGrouping(averageRating.totalOfReviews),
                  })}
                </Trigger>
              </Dialog>
            </SpaceFlex>
          </Wrapper>
        </GridLayout.Content>
      </GridLayout.Root>
    </>
  )
}

type DialogProps = {
  children: ReactNode
}

const Dialog = (props: DialogProps) => {
  const { t } = useTranslation('common')
  const {
    rating,
    reviews,
    reviewsDistribution,
    selectedTab,
    setSelectedTab,
    selectedScore,
    setSelectedScore,
  } = useReviews()

  if (!rating) return null

  const tooltipText =
    selectedTab === 'product' ? t('PRODUCT_REVIEWS_DISCLAIMER') : t('TRUSTPILOT_REVIEWS_DISCLAIMER')

  return (
    <ReviewsDialog
      rating={rating}
      reviews={reviews}
      reviewsDistribution={reviewsDistribution}
      selectedTab={selectedTab}
      onSelectedTabChange={setSelectedTab}
      selectedScore={selectedScore}
      onSelectedScoreChange={setSelectedScore}
      tooltipText={tooltipText}
    >
      {props.children}
    </ReviewsDialog>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xxs,
  flexWrap: 'wrap',
})

const Trigger = styled.button({
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.xs,
  textDecoration: 'underline',
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  '@media (hover: hover)': {
    ':hover': {
      color: theme.colors.textPrimary,
    },
  },
})

type AverageRating = NonNullable<ReturnType<typeof useProuctReviewsDataContext>>['averageRating']

const getProductStructuredData = (product: ProductData, averageRating: AverageRating) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.displayNameFull,
    description: product.tagline,
    brand: {
      '@type': 'Brand',
      name: 'Hedvig',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.score,
      bestRating: MAX_SCORE,
      reviewCount: averageRating.totalOfReviews,
    },
  }
}
