import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import CartReviewPage from '@/components/CartReviewPage/CartReviewPage'
import type { CartReviewPageProps } from '@/components/CartReviewPage/CartReviewPage.types'
import { useHandleSubmitStartDates } from '@/components/CartReviewPage/useHandleSubmitStartDates'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

type NextPageProps = Omit<CartReviewPageProps, 'loading'>

const NextCartReviewPage: NextPage<NextPageProps> = ({ products, ...props }) => {
  const router = useRouter()
  const [handleSubmit, { loading, data }] = useHandleSubmitStartDates({
    products,
    onSuccess() {
      router.push(PageLink.checkout())
    },
  })

  const { userErrors } = data?.cartLinesStartDateUpdate ?? {}

  const productsWithErrors = products.map((product) => {
    const error = userErrors?.find((error) => product.lineId === error.lineItemId)
    return {
      errorMessage: error?.message,
      ...product,
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      <CartReviewPage {...props} loading={loading} products={productsWithErrors} />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async (context) => {
  const { req, res, locale } = context

  if (!locale || locale === 'default') return { notFound: true }

  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({
      req,
      res,
      apolloClient,
    })

    const cartCost = shopSession.cart.cost
    const total = parseInt(cartCost.total.amount, 10)
    const subTotal = parseInt(cartCost.subtotal.amount, 10)
    const crossOut = total !== subTotal ? subTotal : undefined

    const cost: CartReviewPageProps['cost'] = { total, subTotal }
    if (crossOut) cost.crossOut = crossOut

    return {
      props: {
        ...(await serverSideTranslations(locale)),
        products: shopSession.cart.lines.map((line) => ({
          lineId: line.id,
          name: line.variant.title,
          cost: parseInt(line.price.amount, 10) || 0,
          startDate: line.startDate,
        })),
        cost,
        currency: shopSession.currencyCode,
      },
    }
  } catch (error) {
    console.error('Failed to get server side props for cart review page')
    console.error(error)
    return { notFound: true }
  }
}

export default NextCartReviewPage
