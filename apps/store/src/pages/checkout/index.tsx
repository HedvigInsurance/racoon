import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import { FormElement } from '@/components/CheckoutPage/CheckoutPage.constants'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { addApolloState, initializeApollo } from '@/services/apollo/client'
import { fetchCurrentCheckoutSigning } from '@/services/Checkout/Checkout.helpers'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { convertToDate } from '@/utils/date'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { I18nNamespace } from '@/utils/l10n/types'

type NextPageProps = Omit<CheckoutPageProps, 'loading' | 'userError'> & {
  [SHOP_SESSION_PROP_NAME]: string
}

const NextCheckoutPage: NextPage<NextPageProps> = ({ cart, ...pageProps }) => {
  return (
    <CheckoutPage
      {...pageProps}
      cart={{
        ...cart,
        entries: cart.entries.map((item) => ({
          ...item,
          startDate: convertToDate(item.startDate) ?? undefined,
        })),
      }}
    />
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const [shopSession, translations] = await Promise.all([
      getCurrentShopSessionServerSide({ apolloClient, locale, req, res }),
      serverSideTranslations(locale, [
        I18nNamespace.Common,
        I18nNamespace.Checkout,
        I18nNamespace.Cart,
      ]),
    ])

    const { checkout } = shopSession
    if (!checkout) {
      logger.warn('No checkout info in shopSession')
      return { notFound: true }
    }

    const checkoutId = checkout.id
    const checkoutSigning = await fetchCurrentCheckoutSigning({
      req,
      apolloClient,
      checkoutId,
    })

    const netAmount = shopSession.cart.cost.net.amount
    const grossAmount = shopSession.cart.cost.gross.amount
    const pageProps: NextPageProps = {
      ...translations,
      [SHOP_SESSION_PROP_NAME]: shopSession.id,
      cart: {
        id: shopSession.cart.id,
        cost: {
          currencyCode: shopSession.currencyCode,
          amount: shopSession.cart.cost.net.amount,
          ...(netAmount !== grossAmount && { crossOutAmount: grossAmount }),
        },
        entries: shopSession.cart.entries.map((item) => ({
          offerId: item.id,
          title: item.variant.displayName,
          cost: item.price.amount,
          currencyCode: item.price.currencyCode,
          startDate: item.startDate,
        })),
        campaigns: shopSession.cart.redeemedCampaigns.map((item) => ({
          id: item.id,
          displayName: item.code,
        })),
      },

      prefilledData: {
        [FormElement.FirstName]: checkout.contactDetails.firstName || '',
        [FormElement.LastName]: checkout.contactDetails.lastName || '',
        [FormElement.PersonalNumber]: checkout.contactDetails.personalNumber || '',
        [FormElement.PhoneNumber]: checkout.contactDetails.phoneNumber || '',
        [FormElement.Email]: checkout.contactDetails.email || '',
      },

      checkoutId,
      checkoutSigningId: checkoutSigning?.id ?? null,
    }

    return addApolloState(apolloClient, { props: pageProps })
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPage
