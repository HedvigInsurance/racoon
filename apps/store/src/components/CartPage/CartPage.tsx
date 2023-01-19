import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { ReactNode, useEffect } from 'react'
import { Heading, mq, Space, Text, theme } from 'ui'
import { CampaignCodeList } from '@/components/CartInventory/CampaignCodeList'
import { CartEntryItem } from '@/components/CartInventory/CartEntryItem'
import { CartEntryList } from '@/components/CartInventory/CartEntryList'
import { CostSummary } from '@/components/CartInventory/CostSummary'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { useTracking } from '@/services/Tracking/useTracking'
import { PageLink } from '@/utils/PageLink'
import { ButtonNextLink } from '../ButtonNextLink'
import { CartPageProps } from './CartPageProps.types'
import { RecommendationList } from './RecommendationList'

export const CartPage = (props: CartPageProps) => {
  const { cartId, entries, campaigns, cost, recommendations, prevURL } = props
  const { onReady } = useShopSession()
  const { t } = useTranslation('cart')

  const tracking = useTracking()
  useEffect(
    () =>
      onReady((shopSession) => {
        const { cart } = shopSession
        if (cart) {
          tracking.reportViewCart(cart)
        } else {
          datadogLogs.logger.error('No cart data on cartPage')
        }
      }),
    [onReady, tracking],
  )

  let body = (
    <EmptyState prevURL={prevURL}>
      <Space y={1.5}>
        <HorizontalLine />
        <CampaignCodeList cartId={cartId} campaigns={campaigns} />
        <HorizontalLine />
        <CostSummary {...cost} campaigns={campaigns} />
      </Space>
    </EmptyState>
  )

  if (entries.length > 0) {
    body = (
      <Wrapper y={{ base: 1, lg: 4 }}>
        <Header prevURL={prevURL} />
        <Space y={1.5}>
          <CartEntryList>
            {entries.map((item) => (
              <CartEntryItem key={item.offerId} cartId={cartId} {...item} />
            ))}
          </CartEntryList>
          <HorizontalLine />
          <CampaignCodeList cartId={cartId} campaigns={campaigns} />
          <HorizontalLine />
          <CostSummary {...cost} campaigns={campaigns} />
          <ButtonNextLink href={PageLink.checkout()}>{t('CHECKOUT_BUTTON')}</ButtonNextLink>
        </Space>
      </Wrapper>
    )
  }

  return (
    <Space y={2}>
      {body}
      <RecommendationList recommendations={recommendations} />
    </Space>
  )
}

type EmptyStateProps = { children: ReactNode; prevURL: string }

const EmptyState = ({ children, prevURL }: EmptyStateProps) => {
  const { t } = useTranslation('cart')

  return (
    <Wrapper y={4}>
      <Header prevURL={prevURL} />
      <Space y={2}>
        <Space y={1}>
          <Text align="center">¯\_(ツ)_/¯</Text>
          <Text align="center" color="textSecondary">
            {t('CART_EMPTY_SUMMARY')}
          </Text>
        </Space>
        <ButtonNextLink href={PageLink.store()}>{t('GO_TO_STORE_BUTTON')}</ButtonNextLink>
      </Space>
      {children}
    </Wrapper>
  )
}

const HorizontalLine = styled.hr({
  backgroundColor: theme.colors.gray300,
  height: 1,
})

const Wrapper = styled(Space)({
  maxWidth: '40rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
})

// Header

type HeaderProps = { prevURL: string }

const Header = ({ prevURL }: HeaderProps) => {
  const { t } = useTranslation('cart')

  return (
    <StyledHeader as="header">
      <HeaderHeading as="h1" variant="standard.24">
        {t('CART_PAGE_HEADING')}
      </HeaderHeading>
      <HeaderLink href={prevURL}>{t('BACK_BUTTON')}</HeaderLink>
    </StyledHeader>
  )
}

const HeaderLink = styled(Link)({
  backgroundColor: theme.colors.light,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },

  [mq.lg]: {
    position: 'absolute',
    top: theme.space.md,
    right: theme.space.md,
  },
})

const HeaderHeading = styled(Heading)({
  [mq.lg]: {
    textAlign: 'center',
    fontSize: theme.fontSizes[8],
  },
})

const StyledHeader = styled(Space)({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  [mq.lg]: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '7rem',
  },
})
