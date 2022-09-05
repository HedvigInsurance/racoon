import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CartPage } from '@/components/CartPage/CartPage'
import { CartPageProps } from '@/components/CartPage/CartPageProps.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getMarketByLocale } from '@/lib/l10n/markets'
import { APOLLO_STATE_PROP_NAME, initializeApollo } from '@/services/apollo/client'
import { useShopSessionQuery } from '@/services/apollo/generated'
import { getShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getGlobalStory, StoryblokPageProps } from '@/services/storyblok/storyblok'

type Props = Pick<StoryblokPageProps, 'globalStory'> & {
  shopSessionId: string
}

const NextCartPage: NextPageWithLayout<Props> = ({ shopSessionId, ...props }) => {
  const { data } = useShopSessionQuery({ variables: { shopSessionId } })

  if (!data) return null

  const products: CartPageProps['products'] = data.shopSession.cart.lines.map((item) => {
    return {
      id: item.id,
      name: item.variant.title,
      cost: parseFloat(item.price.amount),
      currency: item.price.currencyCode,
    }
  })

  const cartCost = data.shopSession.cart.cost
  const total = parseInt(cartCost.total.amount, 10)
  const subTotal = parseInt(cartCost.subtotal.amount, 10)
  const crossOut = total !== subTotal ? subTotal : undefined

  return (
    <CartPage
      cartId={data.shopSession.cart.id}
      products={products}
      cost={{
        total,
        subTotal,
        crossOut,
      }}
      {...props}
    />
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { req, res, locale, preview } = context

  if (!locale || locale === 'default') return { notFound: true }

  const { countryCode } = getMarketByLocale(context.locale)

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
    console.error(error)
    return { notFound: true }
  }
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
