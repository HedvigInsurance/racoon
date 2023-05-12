import { ApolloClient } from '@apollo/client'
import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Props = any
type Params = { shopSessionId: string; status: string }

const PaymentRedirectPage: NextPage = () => null

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { req, res, locale, params } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { status, shopSessionId } = params ?? {}
  if (!status || !shopSessionId) return { notFound: true }

  const fallbackRedirect = {
    redirect: { destination: PageLink.confirmation({ locale, shopSessionId }), permanent: false },
  } as const

  let shopSession: ShopSession, apolloClient: ApolloClient<unknown>
  try {
    apolloClient = await initializeApolloServerSide({ req, res, locale })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    shopSession = await shopSessionService.fetchById(shopSessionId)
  } catch (error) {
    console.error(`Unable to fetch ShopSession: ${shopSessionId}`, error)
    return fallbackRedirect
  }

  if (status === 'success') {
    try {
      const checkoutSteps = await fetchCheckoutSteps({ apolloClient, req, res, shopSession })
      const currentStepIndex = checkoutSteps.findIndex((item) => item === CheckoutStep.Checkout)
      const nextStep = checkoutSteps[currentStepIndex + 1]

      const link = getCheckoutStepLink({ step: nextStep, shopSessionId, locale })
      return { redirect: { destination: link, permanent: false } }
    } catch (error) {
      console.error(`Unable to fetch checkout steps for ShopSession: ${shopSessionId}`, error)
      return fallbackRedirect
    }
  } else {
    console.warn(`Payment failed for ShopSession: ${shopSessionId}`, { status })
    return fallbackRedirect
  }
}

export default PaymentRedirectPage
