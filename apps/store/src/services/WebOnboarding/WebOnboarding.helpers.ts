import { RoutingLocale } from '@/utils/l10n/types'

const PAYMENT_URL_TEMPLATE = process.env.WEB_ONBOARDING_PAYMENT_URL_AFTER_SIGN
const LOCALE_PATTERN = '{LOCALE}'

type Params = {
  authorizationCode: string
  locale: RoutingLocale
  redirectURL: URL
}

export const getWebOnboardingPaymentURL = ({ authorizationCode, locale, redirectURL }: Params) => {
  if (PAYMENT_URL_TEMPLATE) {
    const targetUrl = new URL(PAYMENT_URL_TEMPLATE.replaceAll(LOCALE_PATTERN, locale))
    targetUrl.searchParams.set('redirect_url', redirectURL.toString())
    targetUrl.searchParams.set('authorization_code', authorizationCode)
    return targetUrl.toString()
  }

  return null
}
