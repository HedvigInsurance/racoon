import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import CartReviewPage from '@/components/CartReviewPage/CartReviewPage'
import type { CartReviewPageProps } from '@/components/CartReviewPage/CartReviewPage.types'
import { useHandleSubmitCartReview } from '@/components/CartReviewPage/useHandleSubmitCartReview'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

const NextCartReviewPage: NextPage<CartReviewPageProps> = (props) => {
  const router = useRouter()
  const handleSuccess = async () => await router.push(PageLink.checkout())
  const [handleSubmit] = useHandleSubmitCartReview({ onSuccess: handleSuccess })

  return (
    <form onSubmit={handleSubmit}>
      <CartReviewPage {...props} />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<CartReviewPageProps> = async ({ req, res }) => {
  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({
      req,
      res,
      apolloClient,
    })

    const totalCost = shopSession.cart.lines
      .map((line) => parseInt(line.price.amount, 10) || 0)
      .reduce((a, b) => a + b, 0)

    return {
      props: {
        products: shopSession.cart.lines.map((line) => ({
          lineId: line.id,
          name: line.variant.title,
          cost: parseInt(line.price.amount, 10) || 0,
          startDate: line.startDate,
        })),
        cost: {
          total: totalCost,
          subTotal: totalCost,
        },
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
