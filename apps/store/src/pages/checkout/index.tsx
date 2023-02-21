import type { GetServerSideProps, NextPage } from 'next'
import { SSRConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  getCrossOut,
  getTotal,
  useGetDiscountDurationExplanation,
  useGetDiscountExplanation,
} from '@/components/CartInventory/CartInventory.helpers'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { fetchCheckoutSteps } from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { addApolloState, initializeApolloServerSide } from '@/services/apollo/client'
import { ShopSessionSigning } from '@/services/apollo/generated'
import { fetchCurrentShopSessionSigning } from '@/services/Checkout/Checkout.helpers'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { getShouldCollectEmail, getShouldCollectName } from '@/utils/customer'
import { convertToDate } from '@/utils/date'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type NextPageProps = Omit<CheckoutPageProps, 'cart' | 'customerAuthenticationStatus'>

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  if (!shopSession || !shopSession.customer) return null

  const { authenticationStatus } = shopSession.customer

  const cart = {
    id: shopSession.cart.id,
    cost: {
      total: getTotal(shopSession),
      crossOut: getCrossOut(shopSession),
    },
    entries: shopSession.cart.entries.map((item) => ({
      offerId: item.id,
      title: item.variant.product.displayNameFull,
      cost: item.price,
      startDate: !item.cancellation.requested ? convertToDate(item.startDate) : undefined,
      pillow: {
        src: item.variant.product.pillowImage.src,
        alt: item.variant.product.pillowImage.alt ?? undefined,
      },
      documents: item.variant.documents,
      productName: item.variant.product.name,
      data: item.priceIntentData,
    })),
    campaigns: shopSession.cart.redeemedCampaigns.map((item) => ({
      id: item.id,
      code: item.code,
      discountExplanation: getDiscountExplanation(item.discount),
      discountDurationExplanation: getDiscountDurationExplanation(
        shopSession.cart.redeemedCampaigns[0].discount,
        shopSession.cart.cost.gross,
      ),
    })),
  }

  return <CheckoutPage {...props} cart={cart} customerAuthenticationStatus={authenticationStatus} />
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const fallbackRedirect = {
    redirect: { destination: PageLink.home({ locale }), permanent: false },
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
      fetchCheckoutSteps({ apolloClient, shopSession }),
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
