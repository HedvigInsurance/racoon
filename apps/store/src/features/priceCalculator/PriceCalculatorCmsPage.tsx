import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { tokens, xStack, yStack } from 'ui'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDataProvider } from '@/components/ProductPage/ProductPageDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { ProductHero } from '@/components/ProductPage/PurchaseForm/ProductHero/ProductHero'
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

// TODO: Make it responsive or stop using it. It should probably be a CSS var
const HEADER_HEIGHT = '80px'

// TODO: Convert to vanilla styles when we get to look and feel part
export function PriceCalculatorCmsPage({ locale, story }: Props) {
  if (process.env.FEATURE_PRICE_CALCULATOR_PAGE !== 'true') {
    throw notFound()
  }
  // TODO: Take from story
  const productName = 'SE_PET_DOG'
  return (
    <div
      className={xStack({ gap: 'none' })}
      style={{ backgroundColor: tokens.colors.backgroundStandard }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '50%',
          height: `calc(100vh - ${HEADER_HEIGHT})`,
        }}
        className={yStack({ justifyContent: 'center', alignItems: 'center' })}
      >
        <Suspense>
          <ProductHeroContainer locale={locale} productName={productName} />
        </Suspense>
      </div>
      <div
        style={{
          width: '50%',
          flexGrow: 1,
          padding: '1rem',
          minHeight: '100vh',
          backgroundColor: tokens.colors.white,
        }}
      >
        <Suspense fallback={<Skeleton style={{ height: '75vh' }} />}>
          <div style={{ height: '200vh' }}>
            <PriceCalculatorProviders productName={productName} locale={locale} story={story}>
              <PurchaseFormV2 />
            </PriceCalculatorProviders>
          </div>
        </Suspense>
      </div>
    </div>
  )
}

type ProductHeroContainerProps = {
  locale: RoutingLocale
  productName: string
}

async function ProductHeroContainer({ locale, productName }: ProductHeroContainerProps) {
  const apolloClient = getApolloClient({ locale })
  const productData = await fetchProductData({
    apolloClient,
    productName,
  })
  return (
    <ProductHero
      name={productData.displayNameFull}
      pillow={productData.pillowImage}
      size={'large'}
    />
  )
}

type PriceCalculatorProvidersProps = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
  productName: string
  children: ReactNode
}
async function PriceCalculatorProviders({
  locale,
  story,
  productName,
  children,
}: PriceCalculatorProvidersProps) {
  const apolloClient = getApolloClient({ locale })
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
