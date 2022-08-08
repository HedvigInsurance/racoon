import type { GetServerSideProps, NextPage } from 'next'
import CartReviewPage from '@/components/CartReviewPage/CartReviewPage'
import type { CartReviewPageProps } from '@/components/CartReviewPage/CartReviewPage.types'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'

const NextCartReviewPage: NextPage<CartReviewPageProps> = (props) => {
  const { locale } = useCurrentLocale()

  return (
    <form method="post" action={'TODO'}>
      <input type="hidden" name="locale" value={locale} />

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
  { name: 'Home Insurance', cost: 250, currency: 'SEK' },
  { name: 'Apartment Insurance', cost: 100, currency: 'SEK' },
]
const COST = { total: 350, subTotal: 250 }

export default NextCartReviewPage
