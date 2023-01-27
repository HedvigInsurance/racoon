import { StoryblokComponent } from '@storyblok/react'
import { useEffect } from 'react'
import { PriceIntentContextProvider } from '@/components/ProductPage/PriceIntentContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'

export const ProductPage = ({ story, ...props }: ProductPageProps) => {
  // TODO: Provide some tracking API to use with router.ready to check if current page
  //  is the first during window lifetime -> then replace effect with event subscriptions
  const { id, displayNameFull } = props.productData
  const tracking = useTracking()
  useEffect(() => {
    tracking.reportViewProductPage({ id, displayNameFull })
  }, [tracking, id, displayNameFull])

  return (
    <ProductPageContextProvider {...props} story={story}>
      <PriceIntentContextProvider>
        <StoryblokComponent blok={story.content} />
      </PriceIntentContextProvider>
    </ProductPageContextProvider>
  )
}
