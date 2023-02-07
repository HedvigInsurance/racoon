import { ApolloClient } from '@apollo/client'
import {
  CurrentMemberDocument,
  CurrentMemberQuery,
  CurrentMemberQueryVariables,
  ShopSessionAuthenticationStatus,
} from '@/services/apollo/generated'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { PageLink } from '@/utils/PageLink'
import { CheckoutStep } from './Breadcrumbs'

type Params = {
  apolloClient: ApolloClient<unknown>
  shopSession: ShopSession
}

export const fetchCheckoutSteps = async ({ apolloClient, shopSession }: Params) => {
  const switchingEntry = shopSession.cart.entries.find(
    ({ cancellation: { bankSignering } }) => !!bankSignering,
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

export const getCheckoutStepLink = (step: CheckoutStep, shopSession: ShopSession) => {
  switch (step) {
    case CheckoutStep.Checkout:
    case CheckoutStep.SwitchingAssistant:
      return PageLink.checkout()
    case CheckoutStep.Payment:
      return PageLink.checkoutPayment({ shopSessionId: shopSession.id })
    case CheckoutStep.Confirmation:
    case CheckoutStep.Done:
      return PageLink.confirmation({ shopSessionId: shopSession.id })
  }
}
