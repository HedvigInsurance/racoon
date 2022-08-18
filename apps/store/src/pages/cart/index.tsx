import type { NextPageWithLayout, GetServerSideProps } from 'next'
import { CartPage } from '@/components/CartPage/CartPage'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { CartPageProps } from '@/components/CartPage/CartPageProps.types'
import { initializeApollo } from '@/services/apollo/client'
import { getShopSessionServerSide, getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

const NextCartPage: NextPageWithLayout<CartPageProps> = (props) => {

  return <CartPage {...props} />
}

export const getServerSideProps: GetServerSideProps<CartPageProps> = async (context) => {
  const { req, res } = context
  try {
    const apolloClient = initializeApollo()

    const shopSession = await
      getCurrentShopSessionServerSide({ req, res, apolloClient })

    const totalCost = shopSession.cart.lines
      .map((line) => parseInt(line.price.amount, 10) || 0)
      .reduce((a, b) => a + b, 0)

    return {
      props: {
        products: shopSession.cart.lines.map((item) => {
          return { name: item.variant.title, cost: item.price.amount, currency: item.price.currencyCode }
        }),
        cost: {
          total: totalCost,
          subTotal: totalCost,
        },
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }
}

NextCartPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextCartPage
