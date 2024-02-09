import type { GetServerSideProps, NextPage } from 'next'
import { SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { fetchCurrentShopSessionSigning } from '@/services/Checkout/Checkout.helpers'
import { ShopSessionSigning } from '@/services/graphql/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type NextPageProps = Omit<
  CheckoutPageProps,
  'cart' | 'customerAuthenticationStatus' | 'shopSession'
>

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { shopSession } = useShopSession()

  if (!shopSession?.customer) return null

  const { authenticationStatus } = shopSession.customer

  return (
    <CheckoutPage
      {...props}
      shopSession={shopSession}
      customerAuthenticationStatus={authenticationStatus}
    />
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  patchNextI18nContext(context)
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const fallbackRedirect = {
    redirect: { destination: PageLink.home({ locale }).toString(), permanent: false },
  } as const

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  let shopSession: ShopSession, translations: SSRConfig
  try {
    ;[shopSession, translations] = await Promise.all([
      getCurrentShopSessionServerSide({ apolloClient, req, res }),
      serverSideTranslations(locale),
    ])
  } catch (error) {
    console.warn('Checkout | Unable to fetch shop session', error)
    return fallbackRedirect
  }

  const customer = shopSession.customer
  if (!customer) {
    console.warn('Checkout | No customer in shop session', shopSession.id)
    return fallbackRedirect
  }

  if (!customer.ssn) {
    console.warn('Checkout | No SSN in shop session', shopSession.id)
    return fallbackRedirect
  }

  let checkoutSteps: Array<CheckoutStep>, shopSessionSigning: ShopSessionSigning | null
  try {
    ;[checkoutSteps, shopSessionSigning] = await Promise.all([
      fetchCheckoutSteps({ apolloClient, req, res, shopSession }),
      fetchCurrentShopSessionSigning({ apolloClient, req }),
    ])
  } catch (error) {
    console.warn('Checkout | Unable to fetch checkout data', error)
    return fallbackRedirect
  }

  const pageProps: NextPageProps = {
    ...translations,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
    ssn: customer.ssn,
    shouldCollectEmail: getShouldCollectEmail(customer),
    ...(customer.email && { suggestedEmail: customer.email }),
    shouldCollectName: getShouldCollectName(customer),
    shopSessionSigningId: shopSessionSigning?.id ?? null,
    checkoutSteps,
  }

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextCheckoutPage
