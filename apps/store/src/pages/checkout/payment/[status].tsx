import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { isRoutingLocale } from '@/lib/l10n/localeUtils'
import { PageLink } from '@/lib/PageLink'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { getCurrentShopSessionServerSide } from '@/services/shopSession/ShopSession.helpers'

const PaymentRedirectPage: NextPage = () => {
  return (
    <div>
      Something went wrong. Please <Link href={PageLink.checkoutPayment()}>try again</Link>.
    </div>
  )
}

type Props = Record<string, unknown>
type Params = { status: string }

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { req, res, locale, params } = context
  const status = params?.status

  if (!status) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSession = await getCurrentShopSessionServerSide({ req, res, apolloClient })

    const isPaymentBeforeSign =
      shopSession.checkout.paymentConnectionFlow === PaymentConnectionFlow.BeforeSign

    if (isPaymentBeforeSign) {
      // This should not happen
      logger.warn('BEFORE_SIGN ShopSession incorrectly on payment redirect page', {
        shopSessionId: shopSession.id,
      })
      return {
        redirect: {
          destination: PageLink.checkoutPayment({ locale }),
          permanent: false,
        },
      }
    }

    if (status === 'success') {
      return {
        redirect: {
          destination: PageLink.confirmation({ locale, shopSessionId: shopSession.id }),
          permanent: false,
        },
      }
    } else {
      return { props: {} }
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default PaymentRedirectPage
