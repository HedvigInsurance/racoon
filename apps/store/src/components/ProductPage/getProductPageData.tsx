import type { ProductData } from '@/components/ProductData/ProductData.types'
import type { ProductPageStory, ProductStory } from '@/services/storyblok/storyblok'

export type ProductPageData = {
  product: {
    name: string
    description: string
    tagline?: string
  }
}

export const getProductPageData = (
  story: ProductStory | ProductPageStory,
  productData: ProductData,
) => {
  return {
    product: {
      name: story.content.name || productData.displayNameShort,
      description: story.content.description || productData.displayNameFull,
      tagline: story.content.tagline,
    },
  }
}
