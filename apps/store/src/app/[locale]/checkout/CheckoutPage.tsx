'use client'

import { useTranslation } from 'next-i18next'
import { Card, Divider, Heading, Text, yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { TextWithLink } from '@/components/TextWithLink'
import { BUNDLE_DISCOUNT_PERCENTAGE } from '@/features/bundleDiscount/bundleDiscount.constants'
import { BundleDiscountProductLinks } from '@/features/bundleDiscount/components/BundleDiscountProductLinks/BundleDiscountProductLinks'
import { useBundleDiscounts } from '@/features/bundleDiscount/hooks/useBundleDiscounts'
import { CartDiscount } from '@/features/CartDiscount/CartDiscount'
import { CartTotal } from '@/features/CartTotal/CartTotal'
import { CrossSell } from '@/features/CrossSell/CrossSell'
import { useRecommendations } from '@/features/CrossSell/hooks/useRecommendations'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { container } from './CheckoutPage.css'
import { CartEntries } from './components/CartEntries'
import { CheckoutDebugDialog } from './components/CheckoutDebugDialog'
import { CheckoutForm } from './components/CheckoutForm/CheckoutForm'
import { EmptyCart, type Product } from './components/EmptyCart/EmptyCart'
import { OrderBreakdown } from './components/OrderBreakdown'

export function CheckoutPage({ locale }: { locale: RoutingLocale }) {
  const { t } = useTranslation(['cart', 'checkout'])

  const productMetadata = useProductMetadata()

  const recommendedOffer = useRecommendations()

  const { shouldShowBundleDiscountProducts } = useBundleDiscounts()

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
        <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
          <header>
            <Heading as="h2" variant={{ _: 'standard.24', sm: 'standard.32' }}>
              {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
            </Heading>
            <Heading
              as="h2"
              variant={{ _: 'standard.24', sm: 'standard.32' }}
              color="textSecondary"
            >
              {t('checkout:CHECKOUT_PAGE_SUBHEADING')}
            </Heading>
          </header>

          <CartEntries />
        </section>

        {shouldShowBundleDiscountProducts ? (
          <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
            <header>
              <Heading as="h2" variant={{ _: 'standard.24', sm: 'standard.32' }}>
                {t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE')}
              </Heading>
              <Heading
                as="h2"
                variant={{ _: 'standard.24', sm: 'standard.32' }}
                color="textSecondary"
              >
                {t('BUNDLE_DISCOUNT_QUICK_LINKS_SUBTITLE', {
                  percentage: BUNDLE_DISCOUNT_PERCENTAGE,
                })}
              </Heading>
            </header>

            <BundleDiscountProductLinks />
          </section>
        ) : null}

        {recommendedOffer ? (
          <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
            <header>
              <Heading as="h2" variant={{ _: 'standard.24', sm: 'standard.32' }}>
                {t('QUICK_ADD_BUNDLE_HEADER')}
              </Heading>
            </header>

            <CrossSell recommendation={recommendedOffer} />
          </section>
        ) : null}

        <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
          <header>
            <Heading as="h2" variant={{ _: 'standard.24', sm: 'standard.32' }}>
              {t('checkout:COMPLETE_PURCHASE_TITLE')}
            </Heading>
            <Heading
              as="h2"
              variant={{ _: 'standard.24', sm: 'standard.32' }}
              color="textSecondary"
            >
              {t('checkout:COMPLETE_PURCHASE_SUBTITLE')}
            </Heading>
          </header>

          <Card.Root variant="secondary">
            <Text>Order summary</Text>

            <OrderBreakdown cart={shopSession.cart} />

            <Divider />

            <CartDiscount shopSession={shopSession} />

            <Divider />

            <CartTotal cart={shopSession.cart} />

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

            <Text align="center">{t('USP_NO_BINDING_TIME')}</Text>
          </Card.Root>

          <TextWithLink
            as="p"
            size="xs"
            align="center"
            balance={true}
            href={PageLink.privacyPolicy({ locale })}
            target="_blank"
          >
            {t('checkout:SIGN_DISCLAIMER')}
          </TextWithLink>
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
