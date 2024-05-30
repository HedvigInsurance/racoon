import type { GetServerSideProps, NextPage } from 'next'
import type { SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ProductMetadataProvider } from '@/appComponents/providers/ProductMetadataProvider'
import type { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import type { GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import {
  fetchGlobalProductMetadata,
  GLOBAL_PRODUCT_METADATA_PROP_NAME,
} from '@/components/LayoutWithMenu/fetchProductMetadata'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { fetchCurrentShopSessionSigning } from '@/services/Checkout/Checkout.helpers'
import type { ShopSessionSigning } from '@/services/graphql/generated'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import type { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type NextPageProps = Omit<CheckoutPageProps, 'cart' | 'shopSession'>

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { shopSession } = useShopSession()

  if (!shopSession?.customer) return null

  return (
    <ProductMetadataProvider productMetadata={props[GLOBAL_PRODUCT_METADATA_PROP_NAME]}>
      <CheckoutPage {...props} shopSession={shopSession} />
    </ProductMetadataProvider>
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
  let shopSession: ShopSession, productMetadata: GlobalProductMetadata, translations: SSRConfig
  try {
    ;[shopSession, productMetadata, translations] = await Promise.all([
      getCurrentShopSessionServerSide({ apolloClient, req, res }),
      fetchGlobalProductMetadata({ apolloClient }),
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
    [GLOBAL_PRODUCT_METADATA_PROP_NAME]: productMetadata,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
    ssn: customer.ssn,
    shouldCollectEmail: getShouldCollectEmail(customer),
    shouldCollectName: getShouldCollectName(customer),
    shopSessionSigningId: shopSessionSigning?.id ?? null,
    checkoutSteps,
  }

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextCheckoutPage
