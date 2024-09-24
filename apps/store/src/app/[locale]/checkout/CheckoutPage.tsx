'use client'

import { Heading, yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import type { RoutingLocale } from '@/utils/l10n/types'
import { BonusOffer } from './BonusOffer'
import { container } from './CheckoutPage.css'
import { CartEntries } from './components/CartEntries'
import { CheckoutDebugDialog } from './components/CheckoutDebugDialog'
import { CheckoutForm } from './components/CheckoutForm/CheckoutForm'
import { EmptyCart, type Product } from './components/EmptyCart/EmptyCart'

export function CheckoutPage({ locale }: { locale: RoutingLocale }) {
  const productMetadata = useProductMetadata()
  const { shopSession } = useShopSession()

  if (!shopSession) {
    return <CartSkeleton />
  }

  const isCartEmpty = shopSession.cart.entries.length === 0
  if (isCartEmpty) {
    const products = getAvailableProducts(productMetadata ?? [])

    return <EmptyCart locale={locale} products={products} />
  }

  if (!shopSession.customer) {
    throw new Error(`Checkout | No customer in shop session ${shopSession.id}`)
  }
  if (!shopSession.customer.ssn) {
    throw new Error(`Checkout | No SSN in shop session ${shopSession.id}`)
  }

  return (
    <>
      <main className={container}>
        <section className={yStack({ gap: 'md' })}>
          <CartEntries />
        </section>

        <BonusOffer shopSession={shopSession} />

        <section className={yStack({ gap: 'lg' })}>
          <header>
            <Heading as="h2" variant="standard.32">
              Complete your purchase
            </Heading>
            <Heading as="h2" variant="standard.32" color="textSecondary">
              Sign securely with BankID
            </Heading>
          </header>

          <BankIdContextProvider>
            <CheckoutForm
              shopSessionId={shopSession.id}
              ssn={shopSession.customer.ssn}
              cart={shopSession.cart}
              shouldCollectName={getShouldCollectName(shopSession.customer)}
              shouldCollectEmail={getShouldCollectEmail(shopSession.customer)}
            />
            <BankIdDialog />
          </BankIdContextProvider>
        </section>
      </main>

      <CheckoutDebugDialog />
    </>
  )
}

function getAvailableProducts(productMetadata: GlobalProductMetadata): Array<Product> {
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

export function CartSkeleton() {
  return (
    <main className={container}>
      <section className={yStack({ gap: 'md' })}>
        <Skeleton style={{ height: 200 }} />
        <Skeleton style={{ height: 200 }} />
      </section>

      <section className={yStack({ gap: 'xl' })}>
        <Skeleton style={{ height: 500 }} />
        <Skeleton style={{ height: 180 }} />
      </section>
    </main>
  )
}
