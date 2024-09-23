'use client'

import { useTranslation } from 'next-i18next'
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
import { CartEntries } from './CartEntries'
import { CheckoutDebugDialog } from './CheckoutDebugDialog'
import { CheckoutForm } from './CheckoutForm'
import { layout, content, headings } from './CheckoutPage.css'
import { EmptyCart, type Product } from './EmptyCart'

export function CheckoutPage({ locale }: { locale: RoutingLocale }) {
  const { t } = useTranslation(['cart', 'checkout'])
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
      <main className={layout}>
        <div className={content}>
          <div className={headings}>
            <Heading as="h2" align="center" variant="standard.24">
              {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
            </Heading>
            <Heading
              as="h2"
              balance={true}
              color="textSecondary"
              variant="standard.24"
              align="center"
            >
              {t('CHECKOUT_PAGE_SUBHEADING', { ns: 'checkout' })}
            </Heading>
          </div>

          <section className={yStack({ gap: 'md' })}>
            <CartEntries />
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

export function CartSkeleton() {
  return (
    <main className={layout}>
      <div className={content}>
        <section className={yStack({ gap: 'md' })}>
          <Skeleton style={{ height: 200 }} />
          <Skeleton style={{ height: 200 }} />
        </section>

        <section className={yStack({ gap: 'xl' })}>
          <Skeleton style={{ height: 500 }} />
          <Skeleton style={{ height: 180 }} />
        </section>
      </div>
    </main>
  )
}
