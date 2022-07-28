import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { CurrencyCode } from '@/services/graphql/generated'
import { ProductStory, StoryblokBlockName } from '@/services/storyblok/storyblok'
import { ProductPageProps } from './ProductPage.types'

const productGradient = ['#00BFFF', '#00ff00'] as const

export const ProductPage = ({
  story: initalStory,
  priceFormTemplate,
  priceIntent,
}: ProductPageProps) => {
  const { countryCode } = useCurrentLocale()
  const productStory = useStoryblokState(initalStory)

  const story = useMemo(() => {
    const lineItem = priceIntent.lines?.[0]

    return {
      ...productStory,
      content: {
        ...productStory.content,
        body: (productStory as unknown as ProductStory).content.body.map((block) => {
          const extraProps: Record<string, unknown> = {}
          if (block.component === StoryblokBlockName.ProductSummary) {
            extraProps.gradient = productGradient
            extraProps.title = block.title || productStory.content.name
          } else if (block.component === StoryblokBlockName.PriceCalculator) {
            extraProps.productId = productStory.content.productId
            extraProps.lineId = lineItem?.id ?? null
            extraProps.priceFormTemplate = priceFormTemplate
            extraProps.countryCode = countryCode
            extraProps.product = {
              name: productStory.content.name,
              price: lineItem?.price.amount ?? null,
              currencyCode: CurrencyCode.Sek,
              gradient: productGradient,
            }
          }

          return { ...block, ...extraProps }
        }),
      },
    }
  }, [productStory, priceIntent, priceFormTemplate, countryCode])

  return <StoryblokComponent blok={story.content} />
}
