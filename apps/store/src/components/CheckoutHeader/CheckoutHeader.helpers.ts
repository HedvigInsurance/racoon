import { ApolloClient } from '@apollo/client'
import {
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
  ShopSessionAuthenticationStatus,
  ExternalInsuranceCancellationOption as CancellationOption,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { CheckoutStep } from './Breadcrumbs'

type Params = {
  apolloClient: ApolloClient<unknown>
  shopSession: ShopSession
}

export const fetchCheckoutSteps = async ({ apolloClient, shopSession }: Params) => {
  const switchingEntry = shopSession.cart.entries.find(
    ({ cancellation }) => cancellation.option === CancellationOption.Banksignering,
  )
  const showSwitchingAssistant = !!switchingEntry

  let showPayment = true
  if (
    shopSession.customer?.authenticationStatus === ShopSessionAuthenticationStatus.Authenticated
  ) {
    const { data } = await apolloClient.query<CurrentMemberQuery, CurrentMemberQueryVariables>({
      query: CurrentMemberDocument,
    })
    showPayment = !data.currentMember.hasActivePaymentConnection
  }

  const steps: Array<CheckoutStep> = [CheckoutStep.Checkout]

  if (showPayment) steps.push(CheckoutStep.Payment)
  if (showSwitchingAssistant) steps.push(CheckoutStep.SwitchingAssistant)
  if (steps.length < 3) steps.push(CheckoutStep.Confirmation)
  if (steps.length < 3) steps.push(CheckoutStep.Done)
  return steps
}

type GetCheckoutStepLinkParams = {
  step: CheckoutStep
  shopSession: ShopSession
  locale?: RoutingLocale
}

export const getCheckoutStepLink = ({ step, shopSession, locale }: GetCheckoutStepLinkParams) => {
  switch (step) {
    case CheckoutStep.Checkout:
      return PageLink.checkout()
    case CheckoutStep.SwitchingAssistant:
      return PageLink.checkoutSwitchingAssistant({ locale, shopSessionId: shopSession.id })
    case CheckoutStep.Payment:
      return PageLink.checkoutPayment({ locale, shopSessionId: shopSession.id })
    case CheckoutStep.Confirmation:
    case CheckoutStep.Done:
      return PageLink.confirmation({ locale, shopSessionId: shopSession.id })
  }
}
