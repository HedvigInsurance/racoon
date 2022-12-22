import type { GetServerSideProps, GetServerSidePropsContext, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useGetDiscountExplanation } from '@/components/CartInventory/CartInventory.helpers'
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
  }))

  const campaigns = shopSession.cart.redeemedCampaigns.map((item) => ({
    id: item.id,
    code: item.code,
    explanation: getDiscountExplanation(item.discount),
  }))

  const cartCost = shopSession.cart.cost
  const crossOut = cartCost.gross.amount !== cartCost.net.amount ? cartCost.gross : undefined

  return (
    <CartPage
      cartId={shopSession.cart.id}
      entries={entries}
      campaigns={campaigns}
      cost={{
        total: cartCost.net,
        crossOut,
      }}
      {...props}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  try {
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

  console.log(context.req.headers.referer)
  if (!context.req.headers.referer) return storeURL

  const url = new URL(context.req.headers.referer)

  // External redirect
  if (url.origin !== process.env.NEXT_PUBLIC_ORIGIN_URL) return storeURL

  // Page reload
  if (url.pathname.replace(`/${locale}`, '') === context.resolvedUrl) return storeURL

  return url.pathname
}

export default NextCartPage
