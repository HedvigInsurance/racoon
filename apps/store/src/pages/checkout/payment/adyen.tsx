import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageAdyen } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageAdyen'

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageProps> = async () => {
  return {
    props: {
      currency: 'SEK',
      cost: { total: 0, subTotal: 0 },
      products: [],
    },
  }
}

const NextCheckoutPaymentPageAdyen: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutPaymentPageAdyen {...props} />
}

export default NextCheckoutPaymentPageAdyen
