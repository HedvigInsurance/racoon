import type { GetServerSideProps, NextPage } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { getWebOnboardingPaymentURL } from '@/services/WebOnboarding/WebOnboarding.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const LOGGER = logger.child({ module: 'pages/checkout/payment' })

const NextCheckoutPaymentPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  let shopSession: ShopSession
  try {
    const apolloClient = initializeApollo({ req, res })
    shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })
  } catch (error) {
    LOGGER.error(error, 'Failed to get shop session')
    return { notFound: true }
  }
  const shopSessionLogger = LOGGER.child({ shopSessionId: shopSession.id })

  if (shopSession.checkout.completedAt) {
    return {
      redirect: {
        destination: PageLink.confirmation({ locale, shopSessionId: shopSession.id }),
        permanent: false,
      },
    }
  }

  if (shopSession.checkout.paymentConnectionFlow !== PaymentConnectionFlow.AfterSign) {
    shopSessionLogger.error(
      `Unspported payment connection flow: ${shopSession.checkout.paymentConnectionFlow}`,
    )
    return { notFound: true }
  }

  const redirectBaseURL = PageLink.checkoutPaymentRedirectBase({ locale })
  let redirectURL: URL
  try {
    redirectURL = new URL(redirectBaseURL)
  } catch (error) {
    shopSessionLogger.error(error, `Invalid redirect base URL: ${redirectBaseURL}`)
    return { notFound: true }
  }

  const woPaymentURL = getWebOnboardingPaymentURL({ locale, redirectURL })
  if (!woPaymentURL) {
    shopSessionLogger.error('Web Onboarding payment URL not configured')
    return { notFound: true }
  }

  shopSessionLogger.info('Re-directing user to Web Onboarding for payment connection')
  return { redirect: { destination: woPaymentURL, permanent: false } }
}

export default NextCheckoutPaymentPage
