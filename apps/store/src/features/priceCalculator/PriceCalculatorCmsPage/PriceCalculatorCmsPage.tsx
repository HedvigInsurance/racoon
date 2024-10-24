import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { StorePageProviders } from '@/appComponents/providers/StorePageProviders'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { PriceCalculatorStoryProvider } from '@/features/priceCalculator/PriceCalculatorCmsPage/PriceCalculatorStoryProvider'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import type { PriceCalculatorPageStory } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { type RoutingLocale } from '@/utils/l10n/types'
import { getPriceTemplate } from './PriceCalculatorCmsPage.helpers'
import { PriceCalculatorCmsPageContent } from './PriceCalculatorCmsPageContent/PriceCalculatorCmsPageContent'
import { PriceTemplateProvider } from './PriceTemplateProvider'

type Props = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
}

export function PriceCalculatorCmsPage({ locale, story }: Props) {
  if (!Features.enabled('PRICE_CALCULATOR_PAGE')) {
    throw notFound()
  }
  return (
    <StorePageProviders>
      <Suspense fallback={<Skeleton style={{ height: '50vh' }} />}>
        <PriceCalculatorProviders locale={locale} story={story}>
          <PriceCalculatorCmsPageContent />
        </PriceCalculatorProviders>
      </Suspense>
    </StorePageProviders>
  )
}

const getProductData = async (locale: RoutingLocale, productName: string) => {
  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
  const productData = await fetchProductData({
    apolloClient,
    productName,
  })
  return productData
}

type PriceCalculatorProvidersProps = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
  children: ReactNode
}
async function PriceCalculatorProviders({
  locale,
  story,
  children,
}: PriceCalculatorProvidersProps) {
  const priceTemplate = await getPriceTemplate(story.content.priceTemplate)
  const productData = await getProductData(locale, priceTemplate.productName)
  return (
    <ProductDataProvider productData={productData}>
      <PriceCalculatorStoryProvider story={story}>
        <PriceTemplateProvider priceTemplate={priceTemplate}>{children}</PriceTemplateProvider>
      </PriceCalculatorStoryProvider>
      <ProductPageDebugDialog />
    </ProductDataProvider>
  )
}
