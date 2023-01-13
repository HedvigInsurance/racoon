import type { GetServerSideProps, NextPage } from 'next'
import { initializeApollo } from '@/services/apollo/client'
import { createAuthorizationCode } from '@/services/authApi/oauth'
import { getAuthHeaders } from '@/services/authApi/persist'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { getWebOnboardingPaymentURL } from '@/services/WebOnboarding/WebOnboarding.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

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
    const apolloClient = initializeApollo({ req, res })
    await setupShopSessionServiceServerSide({ apolloClient, req, res }).fetchById(shopSessionId)
    // TODO: validate ShopSession
  } catch (error) {
    throw new Error(`Unable to fetch ShopSession: ${shopSessionId}`, { cause: error })
  }

  let authorizationCode
  try {
    const authHeaders = getAuthHeaders({ req, res })
    authorizationCode = await createAuthorizationCode(authHeaders)
  } catch (error) {
    throw new Error('Failed to create authorization code', { cause: error })
  }

  const redirectBaseURL = PageLink.checkoutPaymentRedirectBase({ locale, shopSessionId })
  let redirectURL: URL
  try {
    redirectURL = new URL(redirectBaseURL)
  } catch (error) {
    throw new Error(`Invalid redirect base URL: ${redirectBaseURL}`)
  }

  const woPaymentURL = getWebOnboardingPaymentURL({ authorizationCode, locale, redirectURL })
  if (!woPaymentURL) {
    throw new Error('Web Onboarding payment URL not configured')
  }

  console.log('Re-directing to Web Onboarding for payment connection')
  return { redirect: { destination: woPaymentURL, permanent: false } }
}

export default NextCheckoutPaymentPage
