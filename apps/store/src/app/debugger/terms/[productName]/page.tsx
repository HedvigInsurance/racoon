import { type ReactNode } from 'react'
import { Heading, tokens, yStack } from 'ui'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { ProductDocumentsBlock } from '@/blocks/ProductDocumentsBlock'
import { fetchProductData } from '@/components/ProductData/fetchProductData'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import { type IsoLocale } from '@/utils/l10n/types'

type Props = {
  params: { productName: string }
}

const LOCALES = ['sv-SE', 'en-SE'] as const

async function ProductTermsPage({ params }: Props) {
  const apolloClient = setupApolloClient({ locale: toRoutingLocale(LOCALES[0]) }).getApolloClient()
  const { productName } = params
  const defaultData = await fetchProductData({
    apolloClient,
    productName,
    // Disable all caching for debugging purposes. We may want to revert it after terms-hub is in production
    context: { fetchOptions: { cache: 'no-store' } },
  })

  return (
    <main className={yStack({ gap: 'xl' })} style={{ maxWidth: '80rem', marginInline: 'auto' }}>
      <Heading as="h1" align="center">
        {getTitle(params.productName)}
      </Heading>
      {defaultData.variants.map((variant) => (
        <VariantDetails
          key={variant.typeOfContract}
          productName={productName}
          typeOfContract={variant.typeOfContract}
        />
      ))}
    </main>
  )
}

export function generateMetadata({ params }: Props) {
  return {
    title: getTitle(params.productName),
  }
}

export default ProductTermsPage

const getTitle = (productName: string) => `${productName} - Terms and conditions`

const variantDetailsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
}

function VariantDetails({
  productName,
  typeOfContract,
}: {
  productName: string
  typeOfContract: string
}) {
  return (
    <div className={yStack()}>
      <Heading
        as="h3"
        variant="standard.32"
        style={{ backgroundColor: tokens.colors.signalAmberFill, paddingBlock: '0.5rem' }}
      >
        {typeOfContract}
      </Heading>
      <div style={variantDetailsStyle} className={yStack({ gap: 'md' })}>
        <SectionHeader>Perils</SectionHeader>
        {LOCALES.map((locale) => (
          <VariantDataProvider
            key={locale + typeOfContract}
            productName={productName}
            typeOfContract={typeOfContract}
            locale={locale}
            keyPrefix="perils"
          >
            <PerilsBlock blok={{ heading: `Locale: ${locale}` }} />
          </VariantDataProvider>
        ))}
        <SectionHeader>Insurable limits</SectionHeader>
        {LOCALES.map((locale) => (
          <VariantDataProvider
            key={locale + typeOfContract}
            productName={productName}
            typeOfContract={typeOfContract}
            locale={locale}
            keyPrefix="limits"
          >
            <InsurableLimitsBlock />
          </VariantDataProvider>
        ))}
        <SectionHeader>Documents</SectionHeader>
        {LOCALES.map((locale) => (
          <VariantDataProvider
            key={locale + typeOfContract}
            productName={productName}
            typeOfContract={typeOfContract}
            locale={locale}
            keyPrefix="docs"
          >
            <ProductDocumentsBlock blok={{ heading: locale, description: '' }} />
          </VariantDataProvider>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Heading
      as="h4"
      variant="standard.24"
      style={{
        gridColumn: '1 / span 2',
        backgroundColor: tokens.colors.signalGreenFill,
        paddingInline: '1rem',
      }}
    >
      {children}
    </Heading>
  )
}

async function VariantDataProvider({
  locale,
  productName,
  typeOfContract,
  children,
  keyPrefix,
}: {
  locale: IsoLocale
  productName: string
  typeOfContract: string
  children: ReactNode
  keyPrefix: string
}) {
  const apolloClient = setupApolloClient({ locale: toRoutingLocale(locale) }).getApolloClient()
  const productData = await fetchProductData({ apolloClient, productName })
  return (
    <ProductDataProvider
      productKey={[keyPrefix, locale, productName, typeOfContract].join(':')}
      productData={productData}
      selectedTypeOfContract={typeOfContract}
    >
      {children}
    </ProductDataProvider>
  )
}
