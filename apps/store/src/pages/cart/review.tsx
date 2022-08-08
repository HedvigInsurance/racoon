import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import CartReviewPage from '@/components/CartReviewPage/CartReviewPage'
import type { CartReviewPageProps } from '@/components/CartReviewPage/CartReviewPage.types'
import { useHandleSubmitCartReview } from '@/components/CartReviewPage/useHandleSubmitCartReview'
import { PageLink } from '@/lib/PageLink'

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

export const getServerSideProps: GetServerSideProps<CartReviewPageProps> = async () => {
  return {
    props: {
      products: PRODUCTS,
      cost: COST,
      currency: 'SEK',
    },
  }
}

const PRODUCTS = [
  { lineId: '1', name: 'Home Insurance', cost: 250, currency: 'SEK' },
  { lineId: '2', name: 'Apartment Insurance', cost: 100, currency: 'SEK' },
]
const COST = { total: 350, subTotal: 250 }

export default NextCartReviewPage
