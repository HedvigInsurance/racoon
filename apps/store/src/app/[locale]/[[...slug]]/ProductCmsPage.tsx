import { StoryblokStory } from '@storyblok/react/rsc'
import { StorePageProviders } from '@/appComponents/providers/StorePageProviders'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { getProductPageData } from '@/components/ProductPage/getProductPageData'
import { ProductPageDataProvider } from '@/components/ProductPage/ProductPageDataProvider'
import { fetchProductReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { getPriceTemplate } from '@/services/PriceCalculator/PriceCalculator.helpers'
import type { ProductStory } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type ProductCmsPageProps = {
  locale: RoutingLocale
  story: ProductStory
}

export const ProductCmsPage = async ({ locale, story }: ProductCmsPageProps) => {
  const priceTemplate = getPriceTemplate(story.content.priceFormTemplateId)
  if (priceTemplate === undefined) {
    throw new Error(`Unknown price template: ${story.content.priceFormTemplateId}`)
  }

  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
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
    <StorePageProviders>
      <ProductDataProvider
        productData={productData}
        selectedTypeOfContract={initialSelectedTypeOfContract}
      >
        <ProductPageDataProvider
          productPageData={getProductPageData(story, productData)}
          priceTemplate={priceTemplate}
        >
          <ProductReviewsMetadataProvider productReviewsMetadata={productReviewsMetadata}>
            <BankIdContextProvider>
              <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
              <PageBannerTriggers blok={story.content} />
              <BankIdDialog />
            </BankIdContextProvider>
          </ProductReviewsMetadataProvider>
        </ProductPageDataProvider>
      </ProductDataProvider>
    </StorePageProviders>
  )
}
