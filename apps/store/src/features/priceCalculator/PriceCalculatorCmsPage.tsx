import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { tokens, xStack, yStack } from 'ui'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { ProductHero } from '@/components/ProductPage/PurchaseForm/ProductHero/ProductHero'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { PriceCalculatorStoryProvider } from '@/features/priceCalculator/PriceCalculatorStoryProvider'
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

// TODO: Make it responsive or stop using it. It should probably be a CSS var
const HEADER_HEIGHT = '80px'

// TODO: Convert to vanilla styles when we get to look and feel part
export async function PriceCalculatorCmsPage({ locale, story }: Props) {
  if (!Features.enabled('PRICE_CALCULATOR_PAGE')) {
    throw notFound()
  }
  const { productName } = await getPriceTemplate(story.content.priceTemplate)
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

type ProductHeroContainerProps = {
  locale: RoutingLocale
  productName: string
}

async function ProductHeroContainer({ locale, productName }: ProductHeroContainerProps) {
  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
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
  const { getApolloClient } = setupApolloClient({ locale })
  const apolloClient = getApolloClient()
  const productData = await fetchProductData({
    apolloClient,
    productName,
  })
  const priceTemplate = await getPriceTemplate(story.content.priceTemplate)
  return (
    <ProductDataProvider productData={productData}>
      <PriceCalculatorStoryProvider story={story}>
        <PriceTemplateProvider priceTemplate={priceTemplate}>{children}</PriceTemplateProvider>
      </PriceCalculatorStoryProvider>
      <ProductPageDebugDialog />
    </ProductDataProvider>
  )
}
