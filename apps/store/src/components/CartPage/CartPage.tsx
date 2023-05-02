import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { CampaignsSection } from '@/components/CartInventory/CampaignsSection'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CartEntryOfferItem } from '@/components/CartInventory/CartEntryOfferItem'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CartPageProps } from './CartPageProps.types'

export const CartPage = (props: CartPageProps) => {
  const { shopSessionId, entries, campaigns, campaignsEnabled, cost } = props
  const { t } = useTranslation('cart')
  const { onReady, shopSession } = useShopSession()
  const { productRecommendations, productRecommendationOffers } = useProductRecommendations()

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

  let body = (
    <EmptyState>
      <Space y={1.5}>
        <HorizontalLine />
        {shopSessionId && campaignsEnabled === true && (
          <>
            <CampaignsSection shopSessionId={shopSessionId} campaigns={campaigns ?? []} />
            <HorizontalLine />
          </>
        )}
        {cost && <CostSummary {...cost} campaigns={campaigns ?? []} />}
      </Space>
    </EmptyState>
  )

  if (entries && entries.length > 0) {
    const showProductRecommendations =
      shopSessionId && productRecommendationOffers && productRecommendationOffers.length > 0

    body = (
      <Space y={{ base: 1, sm: 1.5 }}>
        <Heading mb="3.5rem" as="h2" align="center" variant="standard.24">
          {t('CART_PAGE_HEADING')} ({entries.length})
        </Heading>
        <CartEntryList>
          {shopSessionId &&
            entries.map((item) => (
              <CartEntryItem key={item.offerId} shopSessionId={shopSessionId} {...item} />
            ))}
        </CartEntryList>

        {shopSessionId && campaignsEnabled && (
          <Space y={{ base: 1, sm: 1.5 }}>
            <CampaignsSection shopSessionId={shopSessionId} campaigns={campaigns ?? []} />
            <HorizontalLine />
          </Space>
        )}
        {cost && <CostSummary {...cost} campaigns={campaigns ?? []} />}

        {showProductRecommendations && (
          <CartEntryList>
            {productRecommendationOffers.map(({ offer, product }) => {
              // TODO: improve typing to get rid of this check
              if (!offer) return null
              return (
                <CartEntryOfferItem
                  key={offer.id}
                  shopSessionId={shopSessionId}
                  product={product}
                  offer={offer}
                />
              )
            })}
          </CartEntryList>
        )}

        {shopSession && (
          <ButtonNextLink
            href={PageLink.checkout()}
            onClick={() => {
              tracking.reportBeginCheckout(shopSession.cart)
            }}
          >
            {t('CHECKOUT_BUTTON')}
          </ButtonNextLink>
        )}
      </Space>
    )
  }

  return (
    <PageWrapper>
      <Space y={{ base: 3, sm: 6 }}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            {body}
          </GridLayout.Content>
        </GridLayout.Root>

        {productRecommendations && productRecommendations.length > 0 && (
          <ProductRecommendationList recommendations={productRecommendations} />
        )}
      </Space>
    </PageWrapper>
  )
}

type EmptyStateProps = { children: ReactNode }

const EmptyState = ({ children }: EmptyStateProps) => {
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('cart')

  return (
    <>
      <Heading as={'h2'} align="center">
        {t('CART_PAGE_HEADING')}
      </Heading>
      <EmptyStateWrapper>
        <Space y={2}>
          <Space y={1}>
            <Text align="center">¯\_(ツ)_/¯</Text>
            <Text align="center" color="textSecondary">
              {t('CART_EMPTY_SUMMARY')}
            </Text>
          </Space>
          <ButtonNextLink href={PageLink.store({ locale: routingLocale })}>
            {t('GO_TO_STORE_BUTTON')}
          </ButtonNextLink>
        </Space>
      </EmptyStateWrapper>
      {children}
    </>
  )
}

const PageWrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxl,

  [mq.sm]: {
    paddingTop: theme.space.xxl,
  },
})

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})

const EmptyStateWrapper = styled.div({
  height: '23rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})
