import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { type ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { EditActionButton } from '@/components/ProductItem/EditActionButton'
import { ProductItemSkeleton } from '@/components/ProductItem/ProductItem'
import { ProductItemContainer } from '@/components/ProductItem/ProductItemContainer'
import { RemoveActionButton } from '@/components/ProductItem/RemoveActionButton'
import { QuickAddOfferContainer } from '@/components/QuickAdd/QuickAddOfferContainer'
import { useBonusOffer } from '@/components/QuickAdd/useBonusOffer'
import { DiscountFieldContainer } from '@/components/ShopBreakdown/DiscountFieldContainer'
import { Divider, ShopBreakdown } from '@/components/ShopBreakdown/ShopBreakdown'
import { TotalAmountContainer } from '@/components/ShopBreakdown/TotalAmountContainer'
import {
  BUNDLE_DISCOUNT_PERCENTAGE,
  BUNDLE_DISCOUNT_PROMO_PAGE_PATH,
  hasBundleDiscount,
  hasCartItemsEligibleForBundleDiscount,
} from '@/features/bundleDiscount/bundleDiscount'
import { BundleDiscountExtraProductLinks } from '@/features/bundleDiscount/BundleDiscountExtraProductLinks'
import { readMoreLink } from '@/features/bundleDiscount/BundleDiscountSummary.css'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { PageLink } from '@/utils/PageLink'
import { QueryParam } from './CartPage.constants'
import { PageDebugDialog } from './PageDebugDialog'

export const CartPage = () => {
  const { t } = useTranslation('cart')
  const { shopSession } = useShopSession()
  const router = useRouter()
  const offerRecommendation = useBonusOffer()
  const tracking = useTracking()

  // - Do not show if only accident is in the cart (confusing)
  // - Do not show if there's a discount already (mostly not relevant anymore)
  const shouldShowBundleDiscountProducts =
    shopSession != null &&
    hasCartItemsEligibleForBundleDiscount(shopSession) &&
    !hasBundleDiscount(shopSession)

  const lastItem = shopSession?.cart.entries.at(-1)
  // GOTCHA: useInView did not work on initial navigation for some reason, so let's just report as effect
  useEffect(() => {
    if (shouldShowBundleDiscountProducts && lastItem != null) {
      tracking.reportViewPromotion({
        promotionId: 'bundle_discount',
        creativeName: 'BUNDLE_DISCOUNT_QUICK_LINKS',
        productId: lastItem.product.id,
        productName: lastItem.product.displayNameFull,
        productVariant: lastItem.variant.typeOfContract,
        priceAmount: lastItem.cost.net.amount,
      })
    }
  }, [shouldShowBundleDiscountProducts, tracking, lastItem])

  if (!shopSession || !router.isReady) return <LoadingState />

  if (shopSession.cart.entries.length === 0) {
    return <EmptyState shopSession={shopSession} />
  }

  return (
    <PageWrapper>
      <Space y={{ base: 3.5, lg: 5 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={2}>
              <Heading as="h2" align="center" variant="standard.24">
                {t('CART_PAGE_HEADING')} ({shopSession.cart.entries.length})
              </Heading>
              <Space y={1}>
                <ShopBreakdown>
                  {shopSession.cart.entries.map((item) => (
                    <ProductItemContainer
                      key={item.id}
                      offer={item}
                      defaultExpanded={router.query[QueryParam.ExpandCart] === '1'}
                    >
                      <EditActionButton shopSessionId={shopSession.id} offer={item} />
                      <RemoveActionButton
                        shopSessionId={shopSession.id}
                        offer={item}
                        title={item.product.displayNameFull}
                      />
                    </ProductItemContainer>
                  ))}
                  <DiscountFieldContainer shopSession={shopSession} />
                  <Divider />
                  <TotalAmountContainer cart={shopSession.cart} />
                </ShopBreakdown>

                {shouldShowBundleDiscountProducts && (
                  <BundleDiscountExtraProductLinks>
                    <div>
                      <Text>{t('BUNDLE_DISCOUNT_QUICK_LINKS_TITLE')}</Text>
                      <Text color="textSecondary">
                        {t('BUNDLE_DISCOUNT_QUICK_LINKS_SUBTITLE', {
                          percentage: BUNDLE_DISCOUNT_PERCENTAGE,
                        })}{' '}
                        <Link
                          href={BUNDLE_DISCOUNT_PROMO_PAGE_PATH}
                          target="_blank"
                          className={readMoreLink}
                        >
                          {t('READ_MORE', { ns: 'common' })}
                        </Link>
                      </Text>
                    </div>
                  </BundleDiscountExtraProductLinks>
                )}
              </Space>

              {offerRecommendation && (
                <QuickAddOfferContainer
                  cart={shopSession.cart}
                  shopSessionId={shopSession.id}
                  {...offerRecommendation}
                />
              )}
              <CheckoutButton />
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>
      </Space>

      <PageDebugDialog />
      <ViewCartTrackTrigger />
    </PageWrapper>
  )
}

const CheckoutButton = () => {
  const { t } = useTranslation('cart')
  const locale = useRoutingLocale()
  const tracking = useTracking()
  const { shopSession } = useShopSession()
  const handleClickCheckout = () => {
    tracking.reportBeginCheckout(shopSession!.cart)
  }

  return (
    <ButtonNextLink
      href={PageLink.checkout({ locale, expandCart: true }).toRelative()}
      onClick={handleClickCheckout}
    >
      {t('CHECKOUT_BUTTON')}
    </ButtonNextLink>
  )
}

// Optimization - track in component without children
const ViewCartTrackTrigger = () => {
  const { onReady } = useShopSession()
  const tracking = useTracking()

  useEffect(
    () =>
      onReady((shopSession) => {
        const { cart } = shopSession
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cart) {
          tracking.reportViewCart(cart)
        } else {
          datadogLogs.logger.error('No cart data on cartPage')
        }
      }),
    [onReady, tracking],
  )
  return null
}

const PageWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: '150px',
  minHeight: '100vh',

  [mq.sm]: {
    paddingTop: theme.space.xxl,
  },
})

const LoadingState = () => {
  const { t } = useTranslation('cart')

  return (
    <PageWrapper>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={3.5}>
            <Heading as="h2" align="center" variant="standard.24">
              {t('CART_PAGE_HEADING')}
            </Heading>
            <ShopBreakdown>
              <ProductItemSkeleton />
              <ProductItemSkeleton />
            </ShopBreakdown>
          </Space>
        </GridLayout.Content>
      </GridLayout.Root>
    </PageWrapper>
  )
}

type EmptyStateProps = {
  shopSession: ShopSession
  children?: ReactNode
}

const EmptyState = (props: EmptyStateProps) => {
  const { t } = useTranslation('cart')
  const locale = useRoutingLocale()

  return (
    <PageWrapper>
      <Space y={{ base: 3.5, lg: 5 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={1}>
              <EmptyStateWrapper>
                <Space y={2}>
                  <Space y={1}>
                    <Text align="center">¯\_(ツ)_/¯</Text>
                    <Text align="center" color="textSecondary">
                      {t('CART_EMPTY_SUMMARY')}
                    </Text>
                  </Space>
                  <ButtonNextLink href={PageLink.store({ locale })}>
                    {t('GO_TO_STORE_BUTTON')}
                  </ButtonNextLink>
                </Space>
              </EmptyStateWrapper>

              <DiscountFieldContainer shopSession={props.shopSession} />
              <Divider />
              <TotalAmountContainer cart={props.shopSession.cart} />
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        {props.children}
      </Space>

      <PageDebugDialog />
    </PageWrapper>
  )
}

const EmptyStateWrapper = styled.div({
  height: '23rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})
