import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { useMemo } from 'react'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { ProductStory } from '@/services/storyblok/storyblok'
import { getBlockContext } from './ProductPage.helpers'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({
  story: initalStory,
  priceFormTemplate,
  priceIntent,
}: ProductPageProps) => {
  const { countryCode } = useCurrentLocale()
  const storyblokStory = useStoryblokState(initalStory)

  const story = useMemo(() => {
    const productStory = storyblokStory as ProductStory

    return {
      ...productStory,
      content: {
        ...productStory.content,
        body: productStory.content.body.map((block) => ({
          ...block,
          ...getBlockContext({
            block,
            productStory,
            countryCode,
            priceFormTemplate,
            priceIntent,
          }),
        })),
      },
    }
  }, [storyblokStory, priceIntent, priceFormTemplate, countryCode])

  return <StoryblokComponent blok={story.content} />
}
