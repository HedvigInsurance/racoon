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

type NextPageProps = Omit<CheckoutPageProps, 'loading' | 'userErrors'> & {
  cartId: string
  checkoutId: string
  checkoutSigningId: string | null
}

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { cartId, products, checkoutId, checkoutSigningId, ...pageProps } = props
  const router = useRouter()

  const apolloClient = useApolloClient()
  const [handleSubmit, { loading, userErrors, signingStatus }] = useHandleSubmitCheckout({
    cartId,
    products,
    checkoutId,
    checkoutSigningId,
    onSuccess(accessToken) {
      setupShopSessionServiceClientSide(apolloClient).reset()
      Auth.save(accessToken)
      router.push(PageLink.checkoutPayment())
    },
  })

  const productsWithErrors = products.map((product) => ({
    errorMessage: userErrors[product.offerId],
    ...product,
  }))

  return (
    <form onSubmit={handleSubmit}>
      <CheckoutPage
        {...pageProps}
        loading={loading}
        products={productsWithErrors}
        signingStatus={signingStatus}
        userErrors={userErrors}
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
      getCurrentShopSessionServerSide({ req, res, apolloClient }),
      serverSideTranslations(locale),
    ])

    if (shopSession.checkout.completedAt) {
      return {
        redirect: {
          destination: PageLink.confirmation({ locale, shopSessionId: shopSession.id }),
          permanent: false,
        },
      }
    }

    const checkoutId = shopSession.checkout.id
    const checkoutSigning = await fetchCurrentCheckoutSigning({
      req,
      apolloClient,
      checkoutId,
    })

    return {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        cartId: shopSession.cart.id,
        checkoutId,
        checkoutSigningId: checkoutSigning?.id ?? null,
        prefilledData: {
          [FormElement.FirstName]: shopSession.checkout.contactDetails.firstName || '',
          [FormElement.LastName]: shopSession.checkout.contactDetails.lastName || '',
          [FormElement.PersonalNumber]: shopSession.checkout.contactDetails.personalNumber || '',
          [FormElement.PhoneNumber]: shopSession.checkout.contactDetails.phoneNumber || '',
          [FormElement.Email]: shopSession.checkout.contactDetails.email || '',
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
