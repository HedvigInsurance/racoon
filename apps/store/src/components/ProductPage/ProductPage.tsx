'use client'
import { StoryblokComponent } from '@storyblok/react'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { PriceIntentTrackingProvider } from '@/components/ProductPage/PriceIntentTrackingProvider'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { type ProductPageProps } from './ProductPage.types'
import { ProductPageContextProvider } from './ProductPageContext'
import { ProductPageDebugDialog } from './ProductPageDebugDialog'

export const ProductPage = ({ story, ...props }: ProductPageProps) => {
  return (
    <ProductDataProvider
      productData={props.productData}
      selectedTypeOfContract={props.initialSelectedTypeOfContract}
    >
      <ProductPageContextProvider {...props} story={story}>
        <PriceIntentTrackingProvider>
          <ProductReviewsMetadataProvider productReviewsMetadata={props.productReviewsMetadata}>
            <StoryblokComponent blok={story.content} />
            {props.breadcrumbs && <PageBreadcrumbs items={props.breadcrumbs} />}
            <ProductPageDebugDialog />
            <ProductPageViewTracker />
            <PageBannerTriggers blok={story.content} />
          </ProductReviewsMetadataProvider>
        </PriceIntentTrackingProvider>
      </ProductPageContextProvider>
    </ProductDataProvider>
  )
}
