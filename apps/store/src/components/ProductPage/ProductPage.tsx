import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'

export const ProductPage = ({ story: initalStory, ...props }: ProductPageProps) => {
  const story = useStoryblokState(initalStory)

  return (
    <ProductPageContextProvider {...props} story={story}>
      <StoryblokComponent blok={story.content} />
    </ProductPageContextProvider>
  )
}
