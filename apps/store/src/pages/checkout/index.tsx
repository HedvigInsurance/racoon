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
import { fetchCurrentCheckoutSigning } from '@/services/Checkout/Checkout.helpers'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { useShopSession } from '@/services/shopSession/ShopSessionContext'
import { convertToDate } from '@/utils/date'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextPageProps = Pick<
  CheckoutPageProps,
  'checkoutSigningId' | 'personalNumber' | 'collectName'
> & {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { shopSession } = useShopSession()
  const getDiscountExplanation = useGetDiscountExplanation()
  const getDiscountDurationExplanation = useGetDiscountDurationExplanation()

  if (!shopSession || !shopSession.checkout) return null

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

  const contactDetails = shopSession.checkout.contactDetails
  const prefilledData = {
    [FormElement.Email]: contactDetails.email ?? undefined,
    [FormElement.FirstName]: contactDetails.firstName ?? undefined,
    [FormElement.LastName]: contactDetails.lastName ?? undefined,
  }

  return (
    <CheckoutPage
      {...props}
      checkoutId={shopSession.checkout.id}
      cart={cart}
      prefilledData={prefilledData}
    />
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const [shopSession, translations] = await Promise.all([
      getCurrentShopSessionServerSide({ apolloClient, req, res }),
      serverSideTranslations(locale),
    ])

    const { checkout } = shopSession
    if (!checkout) {
      throw new Error('No checkout info in shopSession')
    }

    const personalNumber = checkout.contactDetails.ssn
    if (!personalNumber) {
      throw new Error('No personal number in shopSession')
    }

    const checkoutSigning = await fetchCurrentCheckoutSigning({
      req,
      apolloClient,
      checkoutId: checkout.id,
    })

    const pageProps: NextPageProps = {
      ...translations,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      personalNumber,
      collectName: !checkout.contactDetails.firstName || !checkout.contactDetails.lastName,
      checkoutSigningId: checkoutSigning?.id ?? null,
    }

    return addApolloState(apolloClient, { props: pageProps })
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPage
