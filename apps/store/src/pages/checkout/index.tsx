import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import CheckoutPage from '@/components/CheckoutPage/CheckoutPage'
import type { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { useHandleSubmitStartDates } from '@/components/CheckoutPage/useHandleSubmitStartDates'
import { initializeApollo } from '@/services/apollo/client'
import logger from '@/services/logger/server'
import { SHOP_SESSION_PROP_NAME } from '@/services/shopSession/ShopSession.constants'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type NextPageProps = Omit<CheckoutPageProps, 'loading'> & {
  cartId: string
}

const NextCheckoutPage: NextPage<NextPageProps> = ({ cartId, products, ...props }) => {
  const router = useRouter()
  const [handleSubmit, { loading, data }] = useHandleSubmitStartDates({
    cartId,
    products,
    onSuccess() {
      router.push(PageLink.checkoutContactDetails())
    },
  })

  const { userErrors } = data?.cartEntriesStartDateUpdate ?? {}

  const productsWithErrors = products.map((product) => {
    const error = userErrors?.find((error) => product.offerId === error.offerId)
    return {
      errorMessage: error?.message,
      ...product,
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <CheckoutPage {...props} loading={loading} products={productsWithErrors} />
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

    const cartCost = shopSession.cart.cost

    const cost: CheckoutPageProps['cost'] = {
      total: cartCost.total.amount,
      subTotal: cartCost.subtotal.amount,
    }
    if (cartCost.total.amount !== cartCost.subtotal.amount) {
      cost.crossOut = cartCost.subtotal.amount
    }

    return {
      props: {
        ...translations,
        [SHOP_SESSION_PROP_NAME]: shopSession.id,
        cartId: shopSession.cart.id,
        products: shopSession.cart.entries.map((offer) => ({
          offerId: offer.id,
          name: offer.variant.displayName,
          cost: offer.price.amount,
          startDate: offer.startDate,
        })),
        cost,
        currency: shopSession.currencyCode,
      },
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPage
