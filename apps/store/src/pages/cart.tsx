import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CartPage } from '@/components/CartPage/CartPage'
import { CartPageProps } from '@/components/CartPage/CartPageProps.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getCountryByLocale } from '@/lib/l10n/countryUtils'
import { isRoutingLocale } from '@/lib/l10n/localeUtils'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import { useShopSessionQuery } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

type Props = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
}

const NextCartPage: NextPageWithLayout<Props> = ({ shopSessionId, ...props }) => {
  const { data } = useShopSessionQuery({ variables: { shopSessionId } })

  if (!data) return null

  const products: CartPageProps['products'] = data.shopSession.cart.entries.map((item) => {
    return {
      id: item.id,
      name: item.title,
      cost: item.price.amount,
      currency: item.price.currencyCode,
    }
  })

  const cartCost = data.shopSession.cart.cost
  const total = cartCost.total.amount
  const subTotal = cartCost.subtotal.amount
  const crossOut = total !== subTotal ? subTotal : undefined

  return (
    <CartPage
      cartId={data.shopSession.cart.id}
      products={products}
      cost={{ total, subTotal, crossOut }}
      {...props}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { req, res, locale, preview } = context

  if (!isRoutingLocale(locale)) return { notFound: true }

  const { countryCode } = getCountryByLocale(locale)

  try {
    const apolloClient = initializeApollo()
    const [shopSession, globalStory] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getGlobalStory({ locale, preview }),
    ])

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        globalStory,
        shopSessionId: shopSession.id,
        [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
      },
    }
  } catch (error) {
    logger.error(error)
    return { notFound: true }
  }
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
