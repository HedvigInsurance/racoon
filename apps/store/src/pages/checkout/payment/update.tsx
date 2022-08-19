import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutUpdatePaymentPage } from '@/components/CheckoutPaymentPage/CheckoutUpdatePaymentPage'

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageProps> = async () => {
  return {
    props: {
      currency: 'SEK',
      cost: { total: 0, subTotal: 0 },
      products: [],
    },
  }
}

const NextCheckoutUpdatePaymentPage: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutUpdatePaymentPage {...props} />
}

export default NextCheckoutUpdatePaymentPage
