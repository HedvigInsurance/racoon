import { type ReactNode, Suspense } from 'react'
import { xStack } from 'ui'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { ProductPageDataProvider } from '@/components/ProductPage/ProductPageDataProvider'
import { ProductPageDebugDialog } from '@/components/ProductPage/ProductPageDebugDialog'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { getApolloClient } from '@/services/apollo/app-router/rscClient'
import { type RoutingLocale } from '@/utils/l10n/types'
import { SE_PET_DOG_NEW } from './priceTemplates/SE_PET_DOG_NEW'
import { PurchaseFormNew } from './PurchaseFormNew'

type Props = {
  locale: RoutingLocale
}
// TODO: Convert to vanilla styles when we get to look and feel part
export function PriceCalculatorPage({ locale }: Props) {
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
          <PriceCalculatorProviders locale={locale}>
            <PurchaseFormNew />
          </PriceCalculatorProviders>
        </Suspense>
      </div>
    </div>
  )
}

type PriceCalculatorProvidersProps = {
  locale: RoutingLocale
  children: ReactNode
}
async function PriceCalculatorProviders({ locale, children }: PriceCalculatorProvidersProps) {
  const apolloClient = getApolloClient({ locale })
  // TODO: Take from story
  const productName = 'SE_PET_DOG'
  const productData = await fetchProductData({
    apolloClient,
    productName,
  })
  const priceTemplate = SE_PET_DOG_NEW
  return (
    <ProductDataProvider productData={productData}>
      <ProductPageDataProvider productPageData={{} as any} priceTemplate={priceTemplate}>
        {children}
        <ProductPageDebugDialog />
      </ProductPageDataProvider>
    </ProductDataProvider>
  )
}
