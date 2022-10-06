import { RoutingLocale } from '@/lib/l10n/types'

const PAYMENT_URL_TEMPLATE = process.env.WEB_ONBOARDING_PAYMENT_URL_AFTER_SIGN

// We've historically been using different locale paths in Web Onboarding
export const convertRoutingLocale = (locale: RoutingLocale) => {
  switch (locale) {
    case 'dk':
    case 'no':
    case 'se':
      return locale

    case 'en-dk':
    case 'en-no':
    case 'en-se':
      return locale.split('-').reverse().join('-')

    case 'da-dk':
    case 'sv-se':
    case 'nb-no':
      return locale.slice(3)
  }
}

type Params = {
  locale: RoutingLocale
}

export const getWebOnboardingPaymentURL = ({ locale }: Params) => {
  if (PAYMENT_URL_TEMPLATE) {
    return PAYMENT_URL_TEMPLATE.replace('{LOCALE}', convertRoutingLocale(locale))
  }

  return null
}
