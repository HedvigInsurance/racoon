import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  getCrossOut,
  useGetDiscountDurationExplanation,
  useGetDiscountExplanation,
  getTotal,
} from '@/components/CartInventory/CartInventory.helpers'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import { FormElement } from '@/components/CheckoutPage/CheckoutPage.constants'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import { fetchCurrentShopSessionSigning } from '@/services/Checkout/Checkout.helpers'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextPageProps = Pick<CheckoutPageProps, 'shopSessionSigningId' | 'ssn' | 'collectName'> & {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  if (!shopSession || !shopSession.customer) return null

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
      startDate: convertToDate(item.startDate) ?? undefined,
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

  const prefilledData = {
    [FormElement.Email]: shopSession.customer.email ?? undefined,
    [FormElement.FirstName]: shopSession.customer.firstName ?? undefined,
    [FormElement.LastName]: shopSession.customer.lastName ?? undefined,
  }

  return <CheckoutPage {...props} cart={cart} prefilledData={prefilledData} />
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const apolloClient = initializeApollo({ req, res })
  const [shopSession, translations] = await Promise.all([
    getCurrentShopSessionServerSide({ apolloClient, req, res }),
    serverSideTranslations(locale),
  ])

  const { customer } = shopSession
  if (!customer) throw new Error('No Customer info in Shop Session')
  if (!customer.ssn) throw new Error('No SSN in Shop Session')

  const shopSessionSigning = await fetchCurrentShopSessionSigning({
    apolloClient,
    req,
  })

  const pageProps: NextPageProps = {
    ...translations,
    [SHOP_SESSION_PROP_NAME]: shopSession.id,
    ssn: customer.ssn,
    collectName: !(customer.firstName && customer.lastName),
    shopSessionSigningId: shopSessionSigning?.id ?? null,
  }

  return addApolloState(apolloClient, { props: pageProps })
}

export default NextCheckoutPage
