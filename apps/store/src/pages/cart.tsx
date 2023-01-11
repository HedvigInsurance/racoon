import type { GetServerSideProps, GetServerSidePropsContext, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  getCrossOut,
  useGetDiscountDurationExplanation,
  useGetDiscountExplanation,
  getTotal,
} from '@/components/CartInventory/CartInventory.helpers'
import { CartPage } from '@/components/CartPage/CartPage'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'

type Props = { [SHOP_SESSION_PROP_NAME]: string; prevURL: string }

const NextCartPage: NextPageWithLayout<Props> = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  if (!shopSession) return null

  const entries = shopSession.cart.entries.map((item) => ({
    offerId: item.id,
    title: item.variant.product.displayNameFull,
    cost: item.price,
    startDate: convertToDate(item.startDate) ?? undefined,
    pillow: {
      src: item.variant.product.pillowImage.src,
      alt: item.variant.product.pillowImage.alt ?? undefined,
    },
    documents: item.variant.documents,
    productName: item.variant.product.name,
    data: item.priceIntentData,
  }))

  const campaigns = shopSession.cart.redeemedCampaigns.map((item) => ({
    id: item.id,
    code: item.code,
    discountExplanation: getDiscountExplanation(item.discount),
    discountDurationExplanation: getDiscountDurationExplanation(
      shopSession.cart.redeemedCampaigns[0].discount,
      shopSession.cart.cost.gross,
    ),
  }))

  const cost = {
    total: getTotal(shopSession),
    crossOut: getCrossOut(shopSession),
  }

  return (
    <CartPage
      cartId={shopSession.cart.id}
      entries={entries}
      campaigns={campaigns}
      cost={{ ...cost }}
      {...props}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  logger.info('Test: cart info', { countryCode })
  logger.warn('Test: cart warning')

  try {
    if (Date.now() > 1) {
      throw new Error('test error')
    }
    const apolloClient = initializeApollo({ req, res })
    const [shopSession, translations] = await Promise.all([
      getShopSessionServerSide({ apolloClient, countryCode, req, res }),
      serverSideTranslations(locale),
    ])

    return addApolloState(apolloClient, {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        prevURL: getPrevURL(context, locale),
      },
    })
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }
}

const getPrevURL = (context: GetServerSidePropsContext, locale: RoutingLocale) => {
  const storeURL = PageLink.store({ locale })

  if (!context.req.headers.referer) return storeURL

  const url = new URL(context.req.headers.referer)

  // External redirect
  if (url.origin !== process.env.NEXT_PUBLIC_ORIGIN_URL) return storeURL

  // Page reload
  if (url.pathname.replace(`/${locale}`, '') === context.resolvedUrl) return storeURL

  return url.pathname
}

export default NextCartPage
