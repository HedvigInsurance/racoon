'use client'
import { StoryblokComponent } from '@storyblok/react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { PriceIntentContextProvider } from '@/components/ProductPage/PriceIntentContext'
import { ProductPageTrackingProvider } from '@/components/ProductPage/ProductPageTrackingProvider'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { PageDebugDialog } from './PageDebugDialog'
import { type ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'

export const ProductPage = ({ story, ...props }: ProductPageProps) => {
  return (
    <ProductDataProvider
      productData={props.productData}
      selectedTypeOfContract={props.initialSelectedTypeOfContract}
    >
      <ProductPageContextProvider {...props} story={story}>
        <PriceIntentContextProvider>
          <ProductPageTrackingProvider>
            <ProductReviewsMetadataProvider productReviewsMetadata={props.productReviewsMetadata}>
              <StoryblokComponent blok={story.content} />
              {props.breadcrumbs && <PageBreadcrumbs items={props.breadcrumbs} />}
              <PageDebugDialog />
              <ProductPageViewTracker />
              <PageBannerTriggers blok={story.content} />
            </ProductReviewsMetadataProvider>
          </ProductPageTrackingProvider>
        </PriceIntentContextProvider>
      </ProductPageContextProvider>
    </ProductDataProvider>
  )
}

export const useCartEntryToReplace = () => {
  const searchParams = useSearchParams()
  const cartEntryId = searchParams?.get('replace') as string | undefined
  const { shopSession } = useShopSession()

  return useMemo(
    () => shopSession?.cart.entries.find((item) => item.id === cartEntryId),
    [shopSession?.cart.entries, cartEntryId],
  )
}
