import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { CheckoutContactDetailsPage } from '@/components/CheckoutContactDetailsPage/CheckoutContactDetails'
import { CheckoutContactDetailsPageProps } from '@/components/CheckoutContactDetailsPage/CheckoutContactDetails.types'
import { CheckoutSignPage } from '@/components/CheckoutContactDetailsPage/CheckoutSignPage'
import { useHandleSubmitContactDetails } from '@/components/CheckoutContactDetailsPage/useHandleSubmitContactDetails'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

type NextPageProps = CheckoutContactDetailsPageProps & {
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
        <CheckoutContactDetailsPage {...pageProps} />
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
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default NextCheckoutPage
