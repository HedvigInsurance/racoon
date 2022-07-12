import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPage } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageProps> = async (context) => {
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

const NextCheckoutPaymentPage: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutPaymentPage {...props} />
}

export default NextCheckoutPaymentPage
