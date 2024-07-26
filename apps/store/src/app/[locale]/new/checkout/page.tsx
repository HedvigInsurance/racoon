import { type ApolloClient } from '@apollo/client'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'
import { yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { fetchGlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { setupApolloClient } from '@/services/apollo/app-router/rscClient'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { setupShopSession } from '@/services/shopSession/app-router/ShopSession.utils'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { BonusOffer } from './BonusOffer'
import { CartEntries } from './CartEntries'
import { CheckoutForm } from './CheckoutForm'
import { layout, content } from './CheckoutPage.css'
import { EmptyCart, type Product } from './EmptyCart'

type Params = { locale: RoutingLocale }

type Props = { params: Params }

export default async function Page({ params }: Props) {
  const fallbackRedirectUrl = PageLink.home({ locale: params.locale }).toString()

  const { getApolloClient } = setupApolloClient({ locale: params.locale })
  const apolloClient = getApolloClient()
  const shopSessionService = setupShopSession(apolloClient)
  const shopSession = await shopSessionService.fetch()

  if (!shopSession) {
    console.warn('Checkout | Unable to fetch shop session')
    notFound()
  }

  const isCartEmpty = shopSession.cart.entries.length === 0
  if (isCartEmpty) {
    const products = await getAvailableProducts(apolloClient)

    return <EmptyCart locale={params.locale} products={products} />
  }

  const customer = shopSession.customer
  if (!customer) {
    console.warn('Checkout | No customer in shop session', shopSession.id)
    return redirect(fallbackRedirectUrl)
  }

  if (!customer.ssn) {
    console.warn('Checkout | No SSN in shop session', shopSession.id)
    return redirect(fallbackRedirectUrl)
  }

  return (
    <main className={layout}>
      <div className={content}>
        <section className={yStack({ gap: 'md' })}>
          <CartEntries shopSessionId={shopSession.id} />
        </section>

        <section className={yStack({ gap: 'xl' })}>
          <Suspense>
            <BonusOffer shopSessionId={shopSession.id} />
          </Suspense>

          <Suspense>
            <BankIdContextProvider>
              <CheckoutForm shopSessionId={shopSession.id} />
              <BankIdDialog />
            </BankIdContextProvider>
          </Suspense>
        </section>
      </div>
    </main>
  )
}

async function getAvailableProducts(apolloClient: ApolloClient<unknown>): Promise<Array<Product>> {
  const productMetadata = await fetchGlobalProductMetadata({ apolloClient })
  const products = productMetadata.map(
    ({ id, displayNameShort, tagline, pageLink, pillowImage }) => ({
      id,
      displayName: displayNameShort,
      tagline,
      pageLink,
      pillowImage: {
        src: pillowImage.src,
        alt: pillowImage.alt ?? undefined,
      },
    }),
  )

  return products
}

export const dynamic = 'force-dynamic'
