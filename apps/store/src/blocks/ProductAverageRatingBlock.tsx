import styled from '@emotion/styled'
import Head from 'next/head'
import { Text, InfoIcon, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductData } from '@/components/ProductData/ProductData.types'
import { useProductData } from '@/components/ProductData/ProductDataProvider'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Stars } from '@/components/Stars/Stars'
import { Tooltip } from '@/components/Tooltip/Tooltip'

const MAX_SCORE = 5

type AverageRating = NonNullable<ReturnType<typeof useProductPageContext>['averageRating']>

export const ProductAverageRatingBlock = () => {
  const { averageRating } = useProductPageContext()
  const productData = useProductData()

  if (!averageRating) {
    console.warn(`AverageRatingBlock | Average rating for product ${productData.name} not found`)

    return null
  }

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
                Based on {averageRating.reviewCount} reviews
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
      reviewCount: averageRating.reviewCount,
    },
  }
}
