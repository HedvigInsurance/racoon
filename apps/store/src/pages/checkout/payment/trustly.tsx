import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutPaymentPageTrustly } from '@/components/CheckoutPaymentPage/CheckoutPaymentPageTrustly'

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

const NextCheckoutPaymentPageTrustly: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutPaymentPageTrustly {...props} />
}

export default NextCheckoutPaymentPageTrustly
