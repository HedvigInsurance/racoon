import styled from '@emotion/styled'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { Text, StarIcon, theme, mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { ReviewsDialog } from '@/components/ProductReviews/ReviewsDialog'
import { useReviews } from '@/components/ProductReviews/useReviews'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'

type AverageRating = NonNullable<ReturnType<typeof useProuctReviewsDataContext>>['averageRating']

export const ProductAverageRatingBlock = () => {
  const { t } = useTranslation('common')
  const productReviewsData = useProuctReviewsDataContext()

  const productData = useProductData()

  if (!productReviewsData) {
    console.warn(
      `ProductAverageRatingBlock | Average rating for product ${productData.name} not found`,
    )
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
            <StarIcon />

            <SpaceFlex direction="horizontal" space={0.5} align="center">
              <Text as="span" color="textSecondary" size={{ _: 'sm', md: 'md' }}>
                {t('RATING_SCORE_LABEL', { score: averageRating.score, maxScore: MAX_SCORE })}
              </Text>

              <Text as="span" color="textSecondary">
                •
              </Text>

              <Dialog>
                <Trigger>
                  {t('REVIEWS_COUNT_LABEL', { count: averageRating.totalOfReviews })}
                </Trigger>
              </Dialog>
            </SpaceFlex>
          </Wrapper>
        </GridLayout.Content>
      </GridLayout.Root>
    </>
  )
}

ProductAverageRatingBlock.blockName = 'productAverageRating'

const Dialog = (props: Pick<ComponentProps<typeof ReviewsDialog>, 'children'>) => {
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

  return (
    <ReviewsDialog
      rating={rating}
      reviews={reviews}
      reviewsDistribution={reviewsDistribution}
      selectedTab={selectedTab}
      onSelectedTabChange={setSelectedTab}
      selectedScore={selectedScore}
      onSelectedScoreChange={setSelectedScore}
    >
      {props.children}
    </ReviewsDialog>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space.xs,
  flexWrap: 'wrap',
})

const Trigger = styled.button({
  color: theme.colors.textSecondary,
  fontSize: theme.fontSizes.sm,
  textDecoration: 'underline',
  cursor: 'pointer',

  [mq.md]: {
    fontSize: theme.fontSizes.md,
  },

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  '@media (hover: hover)': {
    ':hover': {
      color: theme.colors.textPrimary,
    },
  },
})

const getProductStructuredData = (product: ProductData, averageRating: AverageRating) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.displayNameFull,
    description: product.tagline,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.score,
      reviewCount: averageRating.totalOfReviews,
    },
  }
}
