import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAvailablePaymentMethods } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.helpers'
import { CheckoutPaymentPageAdyenProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageAdyen } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageAdyen'
import { initializeApollo } from '@/services/apollo/client'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

const NextCheckoutPaymentPageAdyen: NextPage<CheckoutPaymentPageAdyenProps> = (props) => {
  return <CheckoutPaymentPageAdyen {...props} />
}

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageAdyenProps> = async (
  context,
) => {
  const { req, res, locale } = context

  if (!locale || locale === 'default') return { notFound: true }

  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })

    const paymentMethods = await fetchAvailablePaymentMethods({
      apolloClient,
      countryCode: shopSession.countryCode,
    })

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        shopSessionId: shopSession.id,

        paymentMethods,
        currency: shopSession.currencyCode,
        cost: {
          total: parseInt(shopSession.cart.cost.total.amount, 10),
          subTotal: parseInt(shopSession.cart.cost.subtotal.amount, 10),
        },
        products: shopSession.cart.lines.map((line) => ({
          name: line.variant.title,
          cost: parseInt(line.price.amount, 10),
        })),
      },
    }
  } catch (error) {
    console.error('Failed to get server side props for checkout page')
    console.error(error)
    return { notFound: true }
  }
}

export default NextCheckoutPaymentPageAdyen
