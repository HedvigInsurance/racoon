import { RoutingLocale } from '@/utils/l10n/types'

const PAYMENT_URL_TEMPLATE = process.env.WEB_ONBOARDING_PAYMENT_URL_AFTER_SIGN
const LOCALE_PATTERN = '{LOCALE}'

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
  authorizationCode: string
  locale: RoutingLocale
  redirectURL: URL
}

export const getWebOnboardingPaymentURL = ({ authorizationCode, locale, redirectURL }: Params) => {
  if (PAYMENT_URL_TEMPLATE) {
    const targetUrl = new URL(
      PAYMENT_URL_TEMPLATE.replaceAll(LOCALE_PATTERN, convertRoutingLocale(locale)),
    )
    targetUrl.searchParams.set('redirect_url', redirectURL.toString())
    targetUrl.searchParams.set('authorization_code', authorizationCode)
    return targetUrl.toString()
  }

  return null
}
