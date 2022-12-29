import { StoryblokComponent } from '@storyblok/react'
import { PriceIntentContextProvider } from '@/components/ProductPage/PriceIntentContext'
import { ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'

export const ProductPage = ({ story, ...props }: ProductPageProps) => {
  return (
    <ProductPageContextProvider {...props} story={story}>
      <PriceIntentContextProvider>
        <StoryblokComponent blok={story.content} />
      </PriceIntentContextProvider>
    </ProductPageContextProvider>
  )
}
