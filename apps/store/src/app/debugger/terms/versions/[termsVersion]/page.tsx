import { type ReactNode } from 'react'
import { Heading, tokens, yStack } from 'ui'
import { InsurableLimitsBlock } from '@/blocks/InsurableLimitsBlock'
import { PerilsBlock } from '@/blocks/PerilsBlock'
import { ProductDocumentsBlock } from '@/blocks/ProductDocumentsBlock'
import { ProductDataProvider } from '@/components/ProductData/ProductDataProvider'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { ProductVariantDocument, type ProductVariantFragment } from '@/services/graphql/generated'
import { toRoutingLocale } from '@/utils/l10n/localeUtils'
import type { IsoLocale, RoutingLocale } from '@/utils/l10n/types'

const LOCALES = ['sv-SE', 'en-SE'] as const

export default function TermsVersionPage({ params }: { params: { termsVersion: string } }) {
  return (
    <main className={yStack()}>
      <Heading
        as="h1"
        style={{ backgroundColor: tokens.colors.signalAmberFill, paddingBlock: '0.5rem' }}
      >
        {params.termsVersion}
      </Heading>
      {LOCALES.map((locale) => (
        <VersionInLocale key={locale} locale={locale} termsVersion={params.termsVersion} />
      ))}
    </main>
  )
}

async function VersionInLocale({
  locale,
  termsVersion,
}: {
  locale: IsoLocale
  termsVersion: string
}) {
  const apolloClient = setupApolloClient({ locale: toRoutingLocale(locale) }).getApolloClient()
  const { data } = await apolloClient.query({
    query: ProductVariantDocument,
    variables: { termsVersion },
    context: { fetchOptions: { cache: 'no-store' } },
  })

  return (
    <div className={yStack({ gap: 'lg', marginBottom: 'md' })}>
      <Heading
        as="h2"
        style={{ backgroundColor: tokens.colors.signalGreenFill, paddingBlock: '0.5rem' }}
      >
        locale: {locale}
      </Heading>
      <VariantDataProvider
        key={locale + termsVersion}
        locale={toRoutingLocale(locale)}
        variant={data.productVariant}
      >
        <Heading as="h3" variant="standard.24">
          Perils
        </Heading>
        <PerilsBlock blok={{ heading: `Locale: ${locale}` }} />
        <Heading as="h3" variant="standard.24">
          Insurable limits
        </Heading>
        <InsurableLimitsBlock />
        <ProductDocumentsBlock blok={{ heading: 'Documents', description: '' }} />
      </VariantDataProvider>
    </div>
  )
}

function VariantDataProvider({
  locale,
  children,
  variant,
}: {
  locale: RoutingLocale
  children: ReactNode
  variant: ProductVariantFragment
}) {
  return (
    <ProductDataProvider
      productKey={locale}
      productData={{ variants: [variant] } as any}
      selectedTypeOfContract={variant.typeOfContract}
    >
      {children}
    </ProductDataProvider>
  )
}
