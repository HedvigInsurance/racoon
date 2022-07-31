import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { useMemo } from 'react'
import { ProductStory } from '@/services/storyblok/storyblok'
import { getBlockContext } from './ProductPage.helpers'
import { ProductPageProps } from './ProductPage.types'

export const ProductPage = ({
  story: initalStory,
  priceFormTemplate,
  priceIntent,
  shopSession,
}: ProductPageProps) => {
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
            shopSession,
            priceFormTemplate,
            priceIntent,
          }),
        })),
      },
    }
  }, [storyblokStory, priceIntent, priceFormTemplate, shopSession])

  return <StoryblokComponent blok={story.content} />
}
