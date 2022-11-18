import type { GetServerSideProps, NextPage } from 'next'
import logger from '@/services/logger/server'
import { getWebOnboardingPaymentURL } from '@/services/WebOnboarding/WebOnboarding.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const LOGGER = logger.child({ module: 'pages/checkout/payment' })

const NextCheckoutPaymentPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const redirectBaseURL = PageLink.checkoutPaymentRedirectBase({ locale })
  let redirectURL: URL
  try {
    redirectURL = new URL(redirectBaseURL)
  } catch (error) {
    LOGGER.error(error, `Invalid redirect base URL: ${redirectBaseURL}`)
    return { notFound: true }
  }

  const woPaymentURL = getWebOnboardingPaymentURL({ locale, redirectURL })
  if (!woPaymentURL) {
    LOGGER.error('Web Onboarding payment URL not configured')
    return { notFound: true }
  }

  LOGGER.info('Re-directing to Web Onboarding for payment connection')
  return { redirect: { destination: woPaymentURL, permanent: false } }
}

export default NextCheckoutPaymentPage
