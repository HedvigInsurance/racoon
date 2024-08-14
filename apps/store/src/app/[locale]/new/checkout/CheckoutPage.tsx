'use client'

import { yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useShopSessionSuspense } from '@/services/shopSession/app-router/useShopSessionSuspense'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import type { RoutingLocale } from '@/utils/l10n/types'
import { BonusOffer } from './BonusOffer'
import { CartEntries } from './CartEntries'
import { CheckoutDebugDialog } from './CheckoutDebugDialog'
import { CheckoutForm } from './CheckoutForm'
import { layout, content } from './CheckoutPage.css'
import { EmptyCart, type Product } from './EmptyCart'

export function CheckoutPage({
  locale,
  shopSessionId,
}: {
  locale: RoutingLocale
  shopSessionId: string
}) {
  const shopSession = useShopSessionSuspense({
    shopSessionId,
    options: {
      context: { fetchOptions: 'no-store' },
    },
  })
  const productMetadata = useProductMetadata()

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
      <main className={layout}>
        <div className={content}>
          <section className={yStack({ gap: 'md' })}>
            <CartEntries shopSession={shopSession} />
          </section>

          <section className={yStack({ gap: 'xl' })}>
            <BonusOffer shopSession={shopSession} />

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
        </div>
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
