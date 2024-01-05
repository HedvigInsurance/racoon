import styled from '@emotion/styled'
import Head from 'next/head'
import { Text, InfoIcon, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { Stars } from '@/components/ProductReviews/Stars'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import { MAX_SCORE } from '@/features/memberReviews/memberReviews.constants'
import { useProuctReviewsDataContext } from '@/features/memberReviews/ProductReviewsDataProvider'

type AverageRating = NonNullable<ReturnType<typeof useProuctReviewsDataContext>>['averageRating']

export const ProductAverageRatingBlock = () => {
  const productReviewsData = useProuctReviewsDataContext()
  const productData = useProductData()

  if (!productReviewsData) {
    console.warn(`AverageRatingBlock | Average rating for product ${productData.name} not found`)
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
            <Stars score={averageRating.score} />

            <SpaceFlex direction="horizontal" space={0.5} align="center">
              <Text size={{ _: 'sm', md: 'md' }}>
                {/* TODO: lokalise this */}
                {averageRating.score} out of {MAX_SCORE}
              </Text>

              <Text color="textSecondaryOnGray" size={{ _: 'xs', md: 'sm' }}>
                {/* TODO: lokalise this */}
                Based on {averageRating.totalOfReviews} reviews
              </Text>

              {/* TODO: lokalise this */}
              <Tooltip message="These ratings are obtained from users that have made a claim">
                <button style={{ marginTop: 2 }}>
                  <InfoIcon color={theme.colors.textSecondary} />
                </button>
              </Tooltip>
            </SpaceFlex>
          </Wrapper>
        </GridLayout.Content>
      </GridLayout.Root>
    </>
  )
}

ProductAverageRatingBlock.blockName = 'productAverageRating'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space.xs,
  flexWrap: 'wrap',
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
