import { useApolloClient } from '@apollo/client'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import { FormElement } from '@/components/CheckoutPage/CheckoutPage.constants'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { useHandleSubmitCheckout } from '@/components/CheckoutPage/useHandleSubmitCheckout'
import { initializeApollo } from '@/services/apollo/client'
import * as Auth from '@/services/Auth/Auth'
import { fetchCurrentCheckoutSigning } from '@/services/Checkout/Checkout.helpers'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import {
  getCurrentShopSessionServerSide,
  setupShopSessionServiceClientSide,
} from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type NextPageProps = Omit<CheckoutPageProps, 'loading' | 'userError'> & {
  checkoutId: string
  checkoutSigningId: string | null
  shopSessionId: string
}

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { products, checkoutId, checkoutSigningId, shopSessionId, ...pageProps } = props
  const router = useRouter()

  const apolloClient = useApolloClient()
  const [handleSubmit, { loading, userError, signingStatus }] = useHandleSubmitCheckout({
    checkoutId,
    checkoutSigningId,
    onSuccess(accessToken) {
      Auth.save(accessToken)
      setupShopSessionServiceClientSide(apolloClient).reset()
      router.push(PageLink.checkoutPayment({ shopSessionId }))
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      <CheckoutPage
        {...pageProps}
        loading={loading}
        products={products}
        signingStatus={signingStatus}
        userError={userError}
      />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const [shopSession, translations] = await Promise.all([
      getCurrentShopSessionServerSide({ apolloClient, locale, req, res }),
      serverSideTranslations(locale),
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

    return {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        checkoutId,
        checkoutSigningId: checkoutSigning?.id ?? null,
        prefilledData: {
          [FormElement.FirstName]: checkout.contactDetails.firstName || '',
          [FormElement.LastName]: checkout.contactDetails.lastName || '',
          [FormElement.PersonalNumber]: checkout.contactDetails.personalNumber || '',
          [FormElement.PhoneNumber]: checkout.contactDetails.phoneNumber || '',
          [FormElement.Email]: checkout.contactDetails.email || '',
        },
        products: shopSession.cart.entries.map((offer) => ({
          offerId: offer.id,
          name: offer.variant.displayName,
          cost: offer.price.amount,
          startDate: offer.startDate,
        })),
        cart: shopSession.cart,
      },
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPage
