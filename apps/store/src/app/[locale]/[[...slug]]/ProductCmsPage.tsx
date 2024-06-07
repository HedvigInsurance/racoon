import { StoryWithPreviewSupport } from '@/app/[locale]/[[...slug]]/StoryWithPreviewSupport'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { PageBannerTriggers } from '@/components/Banner/PageBannerTriggers'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageContextProvider } from '@/components/ProductPage/ProductPageContext'
import { ProductPageViewTracker } from '@/components/ProductPage/ProductPageViewTrack'
import { fetchProductReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { ProductReviewsMetadataProvider } from '@/features/memberReviews/ProductReviewsMetadataProvider'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
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
        <ProductReviewsMetadataProvider productReviewsMetadata={productReviewsMetadata}>
          <BankIdContextProvider>
            <StoryWithPreviewSupport story={story} />
            <ProductPageViewTracker />
            <PageBannerTriggers blok={story.content} />
            <BankIdDialog />
          </BankIdContextProvider>
        </ProductReviewsMetadataProvider>
      </ProductPageContextProvider>
    </ProductDataProvider>
  )
}
