import { Suspense } from 'react'
import { Heading, yStack } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { locales } from '@/utils/l10n/locales'

function TermsNavigationPage() {
  return (
    <main className={yStack({})} style={{ maxWidth: '40rem', marginInline: 'auto' }}>
      <Heading as="h1" align="center">
        Terms and conditions
      </Heading>
      <Suspense fallback={'Loading...'}>
        <AvailableProductSelector />
      </Suspense>
    </main>
  )
}

async function AvailableProductSelector() {
  const availableProducts = await fetchGlobalProductMetadata({
    apolloClient: setupApolloClient({ locale: locales['sv-SE'].routingLocale }).getApolloClient(),
  })
  return (
    <div className={yStack({})}>
      {availableProducts.map((product) => (
        <ButtonNextLink
          key={product.id}
          variant="secondary-alt"
          href={`/debugger/terms/${product.name}`}
          prefetch={false}
        >
          {product.displayNameFull}
        </ButtonNextLink>
      ))}
    </div>
  )
}

export default TermsNavigationPage
