import type { GetServerSideProps, NextPage } from 'next'
import { createApolloClient } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getWebOnboardingPaymentURL } from '@/services/WebOnboarding/WebOnboarding.helpers'
import { createAuthorizationCode } from '@/utils/auth'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

const LOGGER = logger.child({ module: 'pages/checkout/[shopSessionId]/payment' })

type Props = Record<string, unknown>
type Params = { shopSessionId: string }

const NextCheckoutPaymentPage: NextPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { locale, params, req, res } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const shopSessionId = params?.shopSessionId
  if (!shopSessionId) return { notFound: true }

  try {
    const apolloClient = createApolloClient({ req, res })
    await setupShopSessionServiceServerSide({ apolloClient, req, res }).fetchById(
      shopSessionId,
      toIsoLocale(locale),
    )
    // TODO: validate ShopSession
  } catch (error) {
    logger.error(error, `Unable to fetch ShopSession: ${shopSessionId}`)
    return { notFound: true }
  }

  let authorizationCode
  try {
    authorizationCode = await createAuthorizationCode({ req, res })
  } catch (error) {
    LOGGER.error(error, 'Failed to create authorization code')
    return { notFound: true }
  }

  const redirectBaseURL = PageLink.checkoutPaymentRedirectBase({ locale, shopSessionId })
  let redirectURL: URL
  try {
    redirectURL = new URL(redirectBaseURL)
  } catch (error) {
    LOGGER.error(error, `Invalid redirect base URL: ${redirectBaseURL}`)
    return { notFound: true }
  }

  const woPaymentURL = getWebOnboardingPaymentURL({ authorizationCode, locale, redirectURL })
  if (!woPaymentURL) {
    LOGGER.error('Web Onboarding payment URL not configured')
    return { notFound: true }
  }

  LOGGER.info('Re-directing to Web Onboarding for payment connection')
  return { redirect: { destination: woPaymentURL, permanent: false } }
}

export default NextCheckoutPaymentPage
