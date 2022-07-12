import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageAdyen } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageAdyen'

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageProps> = async () => {
  return {
    props: {
      currency: 'SEK',
      cost: { crossOut: 399, total: 299, subTotal: 399 },
      products: [
        {
          name: 'Hedvig House',
          cost: 149,
        },
        {
          name: 'Hedvig Travel',
          cost: 79,
        },
      ],
      campaigns: [
        {
          name: 'First Campaign',
          discount: -100,
        },
      ],
    },
  }
}

const NextCheckoutPaymentPageAdyen: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutPaymentPageAdyen {...props} />
}

export default NextCheckoutPaymentPageAdyen
