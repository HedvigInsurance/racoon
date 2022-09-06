import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { CheckoutPage } from '@/components/CheckoutPage/CheckoutPage'
import { CheckoutPageProps } from '@/components/CheckoutPage/CheckoutPage.types'
import { CheckoutSignPage } from '@/components/CheckoutPage/CheckoutSignPage'
import { useHandleSubmitContactDetails } from '@/components/CheckoutPage/useHandleSubmitContactDetails'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

type NextPageProps = CheckoutPageProps & {
  checkoutId: string
  flow: PaymentConnectionFlow
}

const NextCheckoutPage: NextPage<NextPageProps> = (props) => {
  const { flow, checkoutId, ...pageProps } = props

  const router = useRouter()
  const [handleSubmit] = useHandleSubmitContactDetails({
    checkoutId,
    onSuccess() {
      router.push(PageLink.checkoutPayment())
    },
  })

  return (
    <form onSubmit={handleSubmit}>
      {flow === PaymentConnectionFlow.BeforeSign ? (
        <CheckoutPage {...pageProps} />
      ) : (
        <CheckoutSignPage {...pageProps} />
      )}
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<NextPageProps> = async ({ req, res }) => {
  try {
    const apolloClient = initializeApollo()
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })

    return {
      props: {
        checkoutId: shopSession.checkout.id,
        prefilledData: shopSession.checkout.contactDetails,
        flow: shopSession.checkout.paymentConnectionFlow,
      },
    }
  } catch (error) {
    console.error('Failed to get server side props for checkout page')
    console.error(error)
    return { notFound: true }
  }
}

export default NextCheckoutPage
