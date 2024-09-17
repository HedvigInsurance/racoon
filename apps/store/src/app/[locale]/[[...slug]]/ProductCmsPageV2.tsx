import { StoryblokStory } from '@storyblok/react/rsc'
import { StoryblokProvider } from '@/appComponents/providers/StoryblokProvider'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { getProductPageData } from '@/components/ProductPage/getProductPageData'
import { ProductPageDataProviderV2 } from '@/components/ProductPage/ProductPageDataProviderV2'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import type { ProductPageStory } from '@/services/storyblok/storyblok'
import type { RoutingLocale } from '@/utils/l10n/types'

type ProductCmsPageProps = {
  locale: RoutingLocale
  story: ProductPageStory
}

export const ProductCmsPageV2 = async ({ locale, story }: ProductCmsPageProps) => {
  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
  const productName = story.content.productId
  const [productData] = await Promise.all([
    fetchProductData({
      apolloClient,
      productName,
    }),
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
      <ProductPageDataProviderV2 productPageData={getProductPageData(story, productData)}>
        <StoryblokProvider>
          <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
        </StoryblokProvider>
        <DefaultDebugDialog />
      </ProductPageDataProviderV2>
    </ProductDataProvider>
  )
}
