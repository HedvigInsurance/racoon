import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { fetchAvailablePaymentMethods } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.helpers'
import { CheckoutPaymentPageAdyenProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageAdyen } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageAdyen'
import { normalizeLocale } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isLocale } from '@/utils/isLocale'

const NextCheckoutPaymentPageAdyen: NextPage<CheckoutPaymentPageAdyenProps> = (props) => {
  return <CheckoutPaymentPageAdyen {...props} />
}

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageAdyenProps> = async (
  context,
) => {
  const { req, res, locale: rawLocale } = context

  const locale = normalizeLocale(rawLocale)
  if (!isLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })

    // @TODO: remove after implementing After Sign connection flow
    if (shopSession.checkout.paymentConnectionFlow === PaymentConnectionFlow.AfterSign) {
      return { redirect: { destination: PageLink.confirmation({ locale }), permanent: false } }
    }

    const paymentMethodsResponse = await fetchAvailablePaymentMethods({
      apolloClient,
      countryCode: shopSession.countryCode,
    })

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        shopSessionId: shopSession.id,
        isPaymentConnected: context.query.authStatus === AuthStatus.Success,

        paymentMethodsResponse,
        currency: shopSession.currencyCode,
        cost: {
          total: parseInt(shopSession.cart.cost.total.amount, 10),
          subTotal: parseInt(shopSession.cart.cost.subtotal.amount, 10),
        },
        products: shopSession.cart.entries.map((line) => ({
          name: line.title,
          cost: parseInt(line.price.amount, 10),
        })),
      },
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPaymentPageAdyen
