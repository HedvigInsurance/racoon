import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { CartPage } from '@/components/CartPage/CartPage'
import { CartPageProps } from '@/components/CartPage/CartPageProps.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { getLocale } from '@/lib/l10n/getLocale'
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

  const totalCost = data.shopSession.cart.lines
    .map((line) => parseInt(line.price.amount, 10) || 0)
    .reduce((a, b) => a + b, 0)
  const cost = { total: totalCost, subTotal: totalCost }

  return <CartPage products={products} cost={cost} {...props} />
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { req, res } = context
  const { countryCode } = getLocale(context.locale)

  try {
    const apolloClient = initializeApollo()
    const [shopSession, globalStory] = await Promise.all([
      getShopSessionServerSide({ req, res, apolloClient, countryCode }),
      getGlobalStory(context.preview),
    ])

    return {
      props: {
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
