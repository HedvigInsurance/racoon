'use client'

import { useTranslation } from 'next-i18next'
import { Heading, yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { CrossSell } from '@/features/CrossSell/CrossSell'
import { useRecommendations } from '@/features/CrossSell/hooks/useRecommendations'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import type { RoutingLocale } from '@/utils/l10n/types'
import { container } from './CheckoutPage.css'
import { EmptyCart, type Product } from './components/EmptyCart/EmptyCart'
import { CartEntries } from './components/CartEntries'
import { CheckoutForm } from './components/CheckoutForm/CheckoutForm'
import { CheckoutDebugDialog } from './components/CheckoutDebugDialog'

export function CheckoutPage({ locale }: { locale: RoutingLocale }) {
  const { t } = useTranslation(['cart', 'checkout'])

  const productMetadata = useProductMetadata()

  const recommendedOffer = useRecommendations()

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
        <section className={yStack({ gap: 'lg' })}>
          <header>
            <Heading as="h2" variant="standard.32">
              {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
            </Heading>
            <Heading as="h2" variant="standard.32" color="textSecondary">
              {t('checkout:CHECKOUT_PAGE_SUBHEADING')}
            </Heading>
          </header>

          <CartEntries />
        </section>

        {recommendedOffer ? (
          <section className={yStack({ gap: 'lg' })}>
            <header>
              <Heading as="h2" variant="standard.32">
                {t('QUICK_ADD_BUNDLE_HEADER')}
              </Heading>
              <Heading as="h2" variant="standard.32" color="textSecondary">
                Save up to 20% for 12 months
              </Heading>
            </header>

            <CrossSell recommendation={recommendedOffer} />
          </section>
        ) : null}

        <section className={yStack({ gap: 'lg' })}>
          <header>
            <Heading as="h2" variant="standard.32">
              {t('checkout:COMPLETE_PURCHASE_TITLE')}
            </Heading>
            <Heading as="h2" variant="standard.32" color="textSecondary">
              {t('checkout:COMPLETE_PURCHASE_SUBTITLE')}
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
