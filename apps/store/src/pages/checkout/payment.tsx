import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { fetchAvailablePaymentMethods } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.helpers'
import { CheckoutPaymentPageAdyenProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageAdyen } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageAdyen'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import { fetchCurrentCheckoutSigning } from '@/services/Checkout/Checkout.helpers'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getWebOnboardingPaymentURL } from '@/services/WebOnboarding/WebOnboarding.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const NextCheckoutPaymentPageAdyen: NextPage<CheckoutPaymentPageAdyenProps> = (props) => {
  return <CheckoutPaymentPageAdyen {...props} />
}

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageAdyenProps> = async (
  context,
) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })

    const isPaymentBeforeSign =
      shopSession.checkout.paymentConnectionFlow === PaymentConnectionFlow.BeforeSign

    // @TODO: remove after implementing After Sign connection flow
    if (!isPaymentBeforeSign) {
      return {
        redirect: {
          destination: PageLink.confirmation({ locale, shopSessionId: shopSession.id }),
          permanent: false,
        },
      }
    }

    if (!isPaymentBeforeSign) {
      const redirectURL = new URL(PageLink.checkoutPaymentRedirectBase({ locale }))
      const woPaymentURL = getWebOnboardingPaymentURL({ locale, redirectURL })
      if (woPaymentURL) {
        return { redirect: { destination: woPaymentURL, permanent: false } }
      }
    }

    const [paymentMethodsResponse, checkoutSigning, translations] = await Promise.all([
      fetchAvailablePaymentMethods({ apolloClient, countryCode: shopSession.countryCode }),
      fetchCurrentCheckoutSigning({ req, apolloClient, checkoutId: shopSession.checkout.id }),
      serverSideTranslations(locale),
    ])

    if (checkoutSigning?.completion) {
      return {
        redirect: {
          destination: PageLink.confirmation({ locale, shopSessionId: shopSession.id }),
          permanent: false,
        },
      }
    }

    return {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        isPaymentConnected: context.query.authStatus === AuthStatus.Success,
        checkoutId: shopSession.checkout.id,
        checkoutSigningId: checkoutSigning?.id ?? null,
        paymentMethodsResponse,
        currency: shopSession.currencyCode,
        cost: {
          total: shopSession.cart.cost.total.amount,
          subTotal: shopSession.cart.cost.subtotal.amount,
        },
        products: shopSession.cart.entries.map((line) => ({
          name: line.variant.displayName,
          cost: line.price.amount,
        })),
      },
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPaymentPageAdyen
