import { Suspense } from 'react'
import { ProductPageBlock } from '@/blocks/ProductPageBlock'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { PageDebugDialog } from '@/components/ProductPage/PageDebugDialog'
import { PriceIntentContextProvider } from '@/components/ProductPage/PriceIntentContext'
import { ProductPageContextProvider } from '@/components/ProductPage/ProductPageContext'
import { ProductPageTrackingProvider } from '@/components/ProductPage/ProductPageTrackingProvider'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import { fetchProductReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import type { RoutingLocale } from '@/utils/l10n/types'

type ProductCmsPageProps = {
  locale: RoutingLocale
  // TODO: Improve type, we may have it in pages router already
  story: any
}

export const ProductCmsPage = async ({ locale, story }: ProductCmsPageProps) => {
  const priceTemplate = getPriceTemplate(story.content.priceFormTemplateId)
  if (priceTemplate === undefined) {
    throw new Error(`Unknown price template: ${story.content.priceFormTemplateId}`)
  }

  const apolloClient = getApolloClient(locale)
  const productName = story.content.productId
  const [productData, productReviewsMetadata] = await Promise.all([
    fetchProductData({
      apolloClient,
      productName,
    }),
    fetchProductReviewsMetadata(productName),
  ])

  const { defaultProductVariant } = story.content
  const initialSelectedVariant = productData.variants.find(
    (item) => item.typeOfContract === defaultProductVariant,
  )
  const initialSelectedTypeOfContract = initialSelectedVariant?.typeOfContract

  return (
    <ProductDataProvider
      productData={productData}
      selectedTypeOfContract={initialSelectedTypeOfContract}
    >
      <ProductPageContextProvider story={story} priceTemplate={priceTemplate}>
        <Suspense>
          <PriceIntentContextProvider>
            <ProductPageTrackingProvider>
              <ProductReviewsMetadataProvider productReviewsMetadata={productReviewsMetadata}>
                <BankIdContextProvider>
                  <ProductPageBlock blok={story.content} />
                  <PageDebugDialog />
                  <ProductPageViewTracker />
                  <PageBannerTriggers blok={story.content} />
                  <BankIdDialog />
                </BankIdContextProvider>
              </ProductReviewsMetadataProvider>
            </ProductPageTrackingProvider>
          </PriceIntentContextProvider>
        </Suspense>
      </ProductPageContextProvider>
    </ProductDataProvider>
  )
}
