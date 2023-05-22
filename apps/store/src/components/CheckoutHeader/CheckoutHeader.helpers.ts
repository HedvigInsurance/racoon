import { ApolloClient } from '@apollo/client'
import {
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
} from '@/services/apollo/generated'
import { getAccessToken } from '@/services/authApi/persist'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { Features } from '@/utils/Features'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { CookieParams } from '@/utils/types'
import { CheckoutStep } from './Breadcrumbs'

type Params = {
  apolloClient: ApolloClient<unknown>
  shopSession: Pick<ShopSession, 'cart'>
} & CookieParams

export const fetchCheckoutSteps = async ({ apolloClient, req, res }: Params) => {
  let showPayment = true
  // NOTE: Cannot rely on shopSession.customer.authenticationStatus if session is complete (we'd NONE for new members)
  const isAuthenticated = !!getAccessToken({ req, res })
  if (isAuthenticated) {
    const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
      query: CurrentMemberDocument,
    })

    showPayment = !data.currentMember.hasActivePaymentConnection
  }

  const steps: Array<CheckoutStep> = [CheckoutStep.Checkout]

  if (showPayment) steps.push(CheckoutStep.Payment)
  if (steps.length < 3) steps.push(CheckoutStep.Confirmation)
  if (steps.length < 3) steps.push(CheckoutStep.Done)
  return steps
}

type GetCheckoutStepLinkParams = {
  step: CheckoutStep
  shopSessionId: string
  locale?: RoutingLocale
}

export const getCheckoutStepLink = ({ step, shopSessionId, locale }: GetCheckoutStepLinkParams) => {
  switch (step) {
    case CheckoutStep.Checkout:
      return PageLink.checkout()
    case CheckoutStep.SwitchingAssistant:
      return PageLink.checkoutSwitchingAssistant({ locale, shopSessionId })
    case CheckoutStep.Payment:
      return Features.enabled('STOREFRONT_CONNECT_PAYMENT')
        ? PageLink.checkoutPaymentTrustly({ locale, shopSessionId })
        : PageLink.checkoutPayment({ locale, shopSessionId })
    case CheckoutStep.Confirmation:
    case CheckoutStep.Done:
      return PageLink.confirmation({ locale, shopSessionId })
  }
}
