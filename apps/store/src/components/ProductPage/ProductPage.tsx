import { StoryblokComponent } from '@storyblok/react'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { PriceIntentContextProvider } from '@/components/ProductPage/PriceIntentContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useDiscountBanner } from '@/utils/useDiscountBanner'
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

  useDiscountBanner()

  return (
    <ProductPageContextProvider {...props} story={story}>
      <PriceIntentContextProvider>
        <StoryblokComponent blok={story.content} />
      </PriceIntentContextProvider>
    </ProductPageContextProvider>
  )
}

export const useCartEntryToReplace = () => {
  const router = useRouter()
  const { shopSession } = useShopSession()

  const cartEntryId = router.query.replace as string | undefined
  return useMemo(
    () => shopSession?.cart.entries.find((item) => item.id === cartEntryId),
    [shopSession?.cart.entries, cartEntryId],
  )
}
