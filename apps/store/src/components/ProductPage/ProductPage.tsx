'use client'
import { StoryblokComponent } from '@storyblok/react'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { PriceIntentTrackingProvider } from '@/components/ProductPage/PriceIntentTrackingProvider'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { type ProductPageProps } from './ProductPage.types'
import { ProductPageDataProvider } from './ProductPageDataProvider'
import { ProductPageDebugDialog } from './ProductPageDebugDialog'

export const ProductPage = (props: ProductPageProps) => {
  return (
    <ProductDataProvider
      productData={props.productData}
      selectedTypeOfContract={props.initialSelectedTypeOfContract}
    >
      <ProductPageDataProvider story={props.story} priceTemplate={props.priceTemplate}>
        <PriceIntentTrackingProvider>
          <ProductReviewsMetadataProvider productReviewsMetadata={props.productReviewsMetadata}>
            <StoryblokComponent blok={props.story.content} />
            {props.breadcrumbs && <PageBreadcrumbs items={props.breadcrumbs} />}
            <ProductPageDebugDialog />
            <ProductPageViewTracker />
            <PageBannerTriggers blok={props.story.content} />
          </ProductReviewsMetadataProvider>
        </PriceIntentTrackingProvider>
      </ProductPageDataProvider>
    </ProductDataProvider>
  )
}
