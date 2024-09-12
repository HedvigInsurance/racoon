import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import {
  pageGrid,
  priceCalculatorSection,
  productHero,
  productHeroSection,
  purchaseFormWrapper,
} from '@/features/priceCalculator/PriceCalculatorCmsPage.css'
import { PriceCalculatorStoryProvider } from '@/features/priceCalculator/PriceCalculatorStoryProvider'
import { ProductHeroV2 } from '@/features/priceCalculator/ProductHeroV2'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'
import type { PriceCalculatorPageStory } from '@/services/storyblok/storyblok'
import { Features } from '@/utils/Features'
import { type RoutingLocale } from '@/utils/l10n/types'
import { PriceTemplateProvider } from './PriceTemplateProvider'
import { PurchaseFormV2 } from './PurchaseFormV2'

type Props = {
  locale: RoutingLocale
  story: PriceCalculatorPageStory
}

export function PriceCalculatorCmsPage({ locale, story }: Props) {
  if (!Features.enabled('PRICE_CALCULATOR_PAGE')) {
    throw notFound()
  }
  return (
    <div className={pageGrid}>
      <Suspense fallback={<Skeleton style={{ height: '50vh' }} />}>
        <PriceCalculatorProviders locale={locale} story={story}>
          <section className={productHeroSection}>
            <ProductHeroV2 className={productHero} />
          </section>
          <section className={priceCalculatorSection}>
            <div className={purchaseFormWrapper}>
              <PurchaseFormV2 />
            </div>
          </section>
        </PriceCalculatorProviders>
      </Suspense>
    </div>
  )
}

const getPriceTemplate = async (templateName: string): Promise<TemplateV2> => {
  try {
    const module_ = await import(`./priceTemplates/${templateName}`)
    const template = module_.default
    if (typeof template !== 'object' || template.name !== templateName) {
      throw new Error('Template module does not export expected default value')
    }
    return template as TemplateV2
  } catch (err) {
    throw new Error(`Failed to find priceTemplate ${templateName}`, { cause: err })
  }
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
