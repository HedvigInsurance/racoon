import type { GetServerSideProps, NextPageWithLayout } from 'next'
import { ConfirmationPage } from '@/components/ConfirmationPage/ConfirmationPage'
import { ConfirmationPageProps } from '@/components/ConfirmationPage/ConfirmationPage.types'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { CheckoutService } from '@/services/checkout/CheckoutService'
import { CookiePersister } from '@/services/checkout/CookiePersister'

export const getServerSideProps: GetServerSideProps<ConfirmationPageProps> = async (context) => {
  const checkoutService = new CheckoutService(new CookiePersister(context.req, context.res))
  const checkout = await checkoutService.checkout()

  if (checkout === null || checkout.type !== 'COMPLETED') {
    return { notFound: true }
  }

  return {
    props: {
      currency: checkout.currency,
      cost: { ...checkout.cost },
      products: checkout.products,
      firstName: checkout.person.firstName,
    },
  }
}

const CheckoutConfirmationPage: NextPageWithLayout<ConfirmationPageProps> = (props) => {
  return <ConfirmationPage {...props} />
}

CheckoutConfirmationPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default CheckoutConfirmationPage
