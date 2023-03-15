import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import {
  fetchCheckoutSteps,
  getCheckoutStepLink,
} from '@/components/CheckoutHeader/CheckoutHeader.helpers'
import { initializeApolloServerSide } from '@/services/apollo/client'
import { setupShopSessionServiceServerSide } from '@/services/shopSession/ShopSession.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { PageLink } from '@/utils/PageLink'

type Props = { shopSessionId: string }
type Params = { shopSessionId: string; status: string }

const PaymentRedirectPage: NextPage<Props> = ({ shopSessionId }) => {
  // TODO: Localise
  return (
    <div>
      Something went wrong. Please{' '}
      <Link href={PageLink.checkoutPayment({ shopSessionId })}>try again</Link>.
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { req, res, locale, params } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const { status, shopSessionId } = params ?? {}
  if (!status || !shopSessionId) return { notFound: true }

  const apolloClient = await initializeApolloServerSide({ req, res, locale })
  const shopSessionService = setupShopSessionServiceServerSide({ apolloClient, req, res })
  const shopSession = await shopSessionService.fetchById(shopSessionId)

  if (status === 'success') {
    const checkoutSteps = await fetchCheckoutSteps({ apolloClient, shopSession })
    const currentStepIndex = checkoutSteps.findIndex((item) => item === CheckoutStep.Checkout)
    const nextStep = checkoutSteps[currentStepIndex + 1]
    const link = getCheckoutStepLink({ step: nextStep, shopSession, locale })

    return { redirect: { destination: link, permanent: false } }
  } else {
    return { props: { shopSessionId } }
  }
}

export default PaymentRedirectPage
