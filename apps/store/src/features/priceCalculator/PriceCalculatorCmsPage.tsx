import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { xStack } from 'ui'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDataProvider } from '@/components/ProductPage/ProductPageDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { PriceCalculatorStoryProvider } from '@/features/priceCalculator/PriceCalculatorStoryProvider'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import type { PriceCalculatorPageStory } from '@/services/storyblok/storyblok'
import { type RoutingLocale } from '@/utils/l10n/types'
import { SE_PET_DOG_V2 } from './priceTemplates/SE_PET_DOG_V2'
import { PurchaseFormV2 } from './PurchaseFormV2'

type Props = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
}
// TODO: Convert to vanilla styles when we get to look and feel part
export function PriceCalculatorCmsPage({ locale, story }: Props) {
  if (process.env.FEATURE_PRICE_CALCULATOR_PAGE !== 'true') {
    throw notFound()
  }
  return (
    <div className={xStack({})} style={{ backgroundColor: 'white', gap: 'initial' }}>
      <div
        style={{
          backgroundColor: 'lightblue',
          position: 'sticky',
          top: 0,
          width: '50%',
        }}
      >
        TODO: background media
      </div>
      <div style={{ minHeight: '300vh', width: '50%', flexGrow: 1, padding: '1rem' }}>
        <Suspense fallback={<Skeleton style={{ height: '75vh' }} />}>
          <PriceCalculatorProviders locale={locale} story={story}>
            <PurchaseFormV2 />
          </PriceCalculatorProviders>
        </Suspense>
      </div>
    </div>
  )
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
  const apolloClient = getApolloClient({ locale })
  // TODO: Take from story
  const productName = 'SE_PET_DOG'
  const productData = await fetchProductData({
    apolloClient,
    productName,
  })
  // TODO: Auto-detect (better) or take from story
  const priceTemplate = SE_PET_DOG_V2
  // TODO: Decide where to take it from or refactor to stop needing it
  const productPageData = {} as any
  return (
    <ProductDataProvider productData={productData}>
      <ProductPageDataProvider productPageData={productPageData} priceTemplate={priceTemplate}>
        <PriceCalculatorStoryProvider story={story}>{children}</PriceCalculatorStoryProvider>
        <ProductPageDebugDialog />
      </ProductPageDataProvider>
    </ProductDataProvider>
  )
}
