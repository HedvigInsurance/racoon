import { StoryblokComponent } from '@storyblok/react'
import { ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'

export const ProductPage = ({ story, ...props }: ProductPageProps) => {
  return (
    <ProductPageContextProvider {...props} story={story}>
      <StoryblokComponent blok={story.content} />
    </ProductPageContextProvider>
  )
}
