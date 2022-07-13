import type { GetServerSideProps, NextPage } from 'next'
import { CheckoutPaymentPageProps } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.types'
import { CheckoutUpdatePaymentPage } from '@/components/CheckoutPaymentPage/CheckoutUpdatePaymentPage'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { CookiePersister } from '@/services/checkout/CookiePersister'

export const getServerSideProps: GetServerSideProps<CheckoutPaymentPageProps> = async (context) => {
  const checkoutService = new CheckoutService(new CookiePersister(context.req, context.res))
  const checkout = await checkoutService.checkout()

  if (checkout === null) {
    return { notFound: true }
  }

  return {
    props: {
      currency: checkout.currency,
      cost: { ...checkout.cost, subTotal: checkout.cost.total },
      products: checkout.products,
    },
  }
}

const NextCheckoutUpdatePaymentPage: NextPage<CheckoutPaymentPageProps> = (props) => {
  return <CheckoutUpdatePaymentPage {...props} />
}

export default NextCheckoutUpdatePaymentPage
