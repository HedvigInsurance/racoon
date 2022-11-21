import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { initializeApollo } from '@/services/apollo/client'
import { PaymentConnectionFlow } from '@/services/apollo/generated'
import logger from '@/services/logger/server'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Props = { shopSessionId: string }
type Params = { shopSessionId: string; status: string }

const PaymentRedirectPage: NextPage<Props> = ({ shopSessionId }) => {
  return (
    <div>
      Something went wrong. Please{' '}
      <Link href={PageLink.checkoutPayment({ shopSessionId })}>try again</Link>.
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { req, res, locale, params } = context
  const status = params?.status
  const shopSessionId = params?.shopSessionId

  if (!status) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }
  if (!shopSessionId) return { notFound: true }

  try {
    const apolloClient = initializeApollo({ req, res })
    const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
    const shopSession = await shopSessionService.fetchById(shopSessionId)

    const isPaymentBeforeSign =
      shopSession.checkout.paymentConnectionFlow === PaymentConnectionFlow.BeforeSign

    if (isPaymentBeforeSign) {
      // This should not happen
      logger.warn('BEFORE_SIGN ShopSession incorrectly on payment redirect page', {
        shopSessionId: shopSession.id,
      })
      return {
        redirect: {
          destination: PageLink.checkoutPayment({ locale, shopSessionId }),
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
      return { props: { shopSessionId } }
    }
  } catch (error) {
    logger.error(error, 'Failed to get server side props for checkout page')
    return { notFound: true }
  }
}

export default PaymentRedirectPage
