import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CartPage } from '@/components/CartPage/CartPage'
import { CartPageProps } from '@/components/CartPage/CartPageProps.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import {
  getGlobalStory,
  StoryblokPageProps,
  StoryblokPreviewData,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { getCountryByLocale } from '@/utils/l10n/countryUtils'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type Props = Pick<StoryblokPageProps, 'globalStory'>

const NextCartPage: NextPageWithLayout<Props> = (props) => {
  const { shopSession } = useShopSession()

  if (!shopSession) return null

  const products: CartPageProps['products'] = shopSession.cart.entries.map((item) => {
    return {
      id: item.id,
      name: item.variant.displayName,
      cost: item.price.amount,
      currency: item.price.currencyCode,
    }
  })

  const campaigns: CartPageProps['campaigns'] = shopSession.cart.redeemedCampaigns.map((item) => ({
    id: item.id,
    displayName: item.code,
  }))

  const cartCost = shopSession.cart.cost
  const grossAmount = cartCost.gross.amount
  const netAmount = cartCost.net.amount
  const crossOut = grossAmount !== netAmount ? netAmount : undefined

  return (
    <CartPage
      shopSessionId={shopSession.id}
      cartId={shopSession.cart.id}
      products={products}
      campaigns={campaigns}
      cost={{ net: grossAmount, gross: netAmount, crossOut }}
      {...props}
    />
  )
}

export const getServerSideProps: GetServerSideProps<
  Props,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { req, res, locale, previewData: { version } = {} } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  try {
    const apolloClient = initializeApollo({ req, res })
    const [shopSession, globalStory, translations] = await Promise.all([
      getShopSessionServerSide({ apolloClient, countryCode, locale, req, res }),
      getGlobalStory({ locale, version }),
      serverSideTranslations(locale),
    ])

    return addApolloState(apolloClient, {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        [GLOBAL_STORY_PROP_NAME]: globalStory,
      },
    })
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
