'use client'

import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button, CheckIcon, grid, Heading, Text, xStack, yStack } from 'ui'
import { BankIdDialog } from '@/components/BankIdDialog/BankIdDialog'
import { type GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { AccidentCrossSellForm } from '@/features/CrossSell/components/AccidentCrossSellForm'
import { CrossSell } from '@/features/CrossSell/CrossSell'
import { useRecommendations } from '@/features/CrossSell/hooks/useRecommendations'
import { BankIdContextProvider } from '@/services/bankId/BankIdContext'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import type { RoutingLocale } from '@/utils/l10n/types'
import { container } from './CheckoutPage.css'
import { CartEntries } from './components/CartEntries'
import { CheckoutDebugDialog } from './components/CheckoutDebugDialog'
import { CheckoutForm } from './components/CheckoutForm/CheckoutForm'
import { EmptyCart, type Product } from './components/EmptyCart/EmptyCart'

export function CheckoutPage({ locale }: { locale: RoutingLocale }) {
  const { t } = useTranslation(['cart', 'checkout'])

  const [isCrossSellDismissed, setIsCrossSellDismissed] = useState(false)

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

  const shouldShowCrossSell = !isCrossSellDismissed && recommendedOffer

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

        {shouldShowCrossSell ? (
          <section className={yStack({ gap: 'lg' })}>
            <header>
              <Heading as="h2" variant="standard.32">
                {t('QUICK_ADD_BUNDLE_HEADER')}
              </Heading>
            </header>

            <CrossSell.Root>
              <CrossSell.Header product={recommendedOffer.product} />

              <ul className={yStack({ gap: 'sm', paddingBlock: 'md', paddingLeft: 'xs' })}>
                <li className={xStack({ gap: 'sm', alignItems: 'center' })}>
                  <CheckIcon size="1rem" role="presentation" />
                  <Text color="textTranslucentSecondary">{t('ACCIDENT_OFFER_USP_1')}</Text>
                </li>

                <li className={xStack({ gap: 'sm', alignItems: 'center' })}>
                  <CheckIcon size="1rem" role="presentation" />
                  <Text color="textTranslucentSecondary">{t('ACCIDENT_OFFER_USP_2')}</Text>
                </li>

                <li className={xStack({ gap: 'sm', alignItems: 'center' })}>
                  <CheckIcon size="1rem" role="presentation" />
                  <Text color="textTranslucentSecondary">{t('ACCIDENT_OFFER_USP_3')}</Text>
                </li>
              </ul>

              <AccidentCrossSellForm offer={recommendedOffer.offer}>
                {({ isCoInsuredUpdated, isPending }) => (
                  <footer className={yStack({ gap: 'md' })}>
                    <div {...grid({ columns: '2', gap: 'xs' })}>
                      <Button
                        variant="secondary"
                        size="medium"
                        onClick={() => setIsCrossSellDismissed(true)}
                      >
                        {t('QUICK_ADD_DISMISS')}
                      </Button>

                      <Button type="submit" size="medium" disabled={isPending} loading={isPending}>
                        {isCoInsuredUpdated ? t('QUICK_ADD_UPDATE') : t('QUICK_ADD_BUTTON')}
                      </Button>
                    </div>
                  </footer>
                )}
              </AccidentCrossSellForm>
            </CrossSell.Root>
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
