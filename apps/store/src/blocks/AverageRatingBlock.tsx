import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import Head from 'next/head'
import { Text, InfoIcon, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { isBrowser } from '@/utils/env'

const MAX_SCORE = 5

type Product = ReturnType<typeof useProductPageContext>['productData']
type AverageRating = NonNullable<ReturnType<typeof useProductPageContext>['averageRating']>

export const AverageRatingBlock = () => {
  const { productData, averageRating } = useProductPageContext()

  if (!averageRating) {
    console.warn(
      `AverageRatingBlock | could not found average rating data for product ${productData.name}.`,
    )

    return null
  }

  return (
    <>
      {isBrowser() && (
        <Head>
          <script
            key="product-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(getProductStructuredData(productData, averageRating)),
            }}
          />
        </Head>
      )}

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

              {/* TODO: extract this into a reusable Tooltip component (ProductItem/StartDate) */}
              <TooltipPrimitive.Provider>
                <TooltipPrimitive.Root delayDuration={0}>
                  <TooltipPrimitive.Trigger asChild={true}>
                    <button style={{ marginTop: 2 }}>
                      <InfoIcon color={theme.colors.textSecondary} />
                    </button>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Portal>
                    <Content sideOffset={5} onClick={(event) => event.stopPropagation()}>
                      <Text size="xs" color="textNegative" align="center">
                        These ratings are obtained from users that have made a claim
                      </Text>
                      <TooltipPrimitive.Arrow />
                    </Content>
                  </TooltipPrimitive.Portal>
                </TooltipPrimitive.Root>
              </TooltipPrimitive.Provider>
            </SpaceFlex>
          </Wrapper>
        </GridLayout.Content>
      </GridLayout.Root>
    </>
  )
}

AverageRatingBlock.blockName = 'averageRating'

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.space.xs,
  flexWrap: 'wrap',
})

const Stars = styled.div<{ score: number }>(({ score }) => ({
  '--percentage': `calc(${score} / 5 * 100%)`,

  display: 'inline-block',
  lineHeight: 1,
  fontSize: theme.fontSizes.xxl,
  fontFamily: 'Times', // make sure ★ appears correctly

  '&::before': {
    content: '"★★★★★"',
    background: `linear-gradient(
      to right,
      ${theme.colors.gray1000} var(--percentage),
      ${theme.colors.gray300} var(--percentage)
    )`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}))

const slideUpAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const slideDownAndFadeAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Content = styled(TooltipPrimitive.Content)({
  paddingInline: theme.space.sm,
  paddingBlock: theme.space.xs,
  paddingBottom: `calc(${theme.space.xs} + 2px)`,
  backgroundColor: theme.colors.gray1000,
  borderRadius: theme.radius[1],

  maxWidth: '20rem',
  maxHeight: 'var(--radix-tooltip-content-available-height)',

  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  transformOrigin: 'var(--radix-tooltip-content-transform-origin)',

  '&[data-side="top"]': {
    animationName: slideUpAndFadeAnimation,
  },

  '&[data-side="bottom"]': {
    animationName: slideDownAndFadeAnimation,
  },
})

const getProductStructuredData = (product: Product, averageRating: AverageRating) => {
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
