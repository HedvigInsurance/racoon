import type { RoutingLocale } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { CheckoutStep } from './CheckoutPage.constants'

type GetCheckoutStepLinkParams = {
  step: CheckoutStep
  shopSessionId: string
  locale: RoutingLocale
}

export function getCheckoutStepLink({ step, shopSessionId, locale }: GetCheckoutStepLinkParams) {
  switch (step) {
    case CheckoutStep.Checkout:
      return PageLink.newCheckout({ locale }).href
    case CheckoutStep.Payment:
      return PageLink.newCheckoutPaymentTrustly({ locale, shopSessionId }).href
    case CheckoutStep.Confirmation:
    case CheckoutStep.Done:
      return PageLink.confirmation({ locale, shopSessionId }).href
  }
}
