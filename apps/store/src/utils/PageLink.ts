import { datadogLogs } from '@datadog/browser-logs'
import { QueryParam } from '@/components/CheckoutPage/CheckoutPage.constants'
import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { RoutingLocale } from '@/utils/l10n/types'

export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040')

type BaseParams = { locale?: RoutingLocale }

type CheckoutPaymentPage = BaseParams & { shopSessionId: string; authStatus?: AuthStatus }
type CheckoutPaymentRedirectBasePage = Required<BaseParams> & { shopSessionId: string }
type AdyenCallbackRoute = Required<BaseParams> & { shopSessionId: string }
type ConfirmationPage = BaseParams & { shopSessionId: string }
type CheckoutPage = BaseParams & { expandCart?: boolean }
type ForeverPage = BaseParams & { code: string }
type CampaignAddRoute = { code: string; next?: string }

// We need explicit locale when doing server-side redirects.  On client side NextJs adds it automatically
const localePrefix = (locale?: RoutingLocale) => (locale ? `/${locale}` : '')

export const PageLink = {
  home: ({ locale }: BaseParams = {}) => localePrefix(locale) || '/',
  // TODO: we probably want a better setup for locale-specific slugs than just hardcoding them
  // and manually maintaining consistency between CMS and code
  store: ({ locale }: Required<BaseParams>) => {
    let slug = 'store'
    if (locale === 'se') {
      slug = 'forsakringar'
    }
    return `${localePrefix(locale)}/${slug}`
  },
  cart: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/cart`,
  checkout: ({ locale, expandCart = false }: CheckoutPage = {}) => {
    const expandCartQueryParam = expandCart ? `?${QueryParam.ExpandCart}=1` : ''
    return `${localePrefix(locale)}/checkout${expandCartQueryParam}`
  },
  checkoutPayment: ({ locale, authStatus, shopSessionId }: CheckoutPaymentPage) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${localePrefix(locale)}/checkout/${shopSessionId}/payment${queryString}`
  },
  checkoutSwitchingAssistant: ({ locale, shopSessionId }: CheckoutPaymentPage) =>
    `${localePrefix(locale)}/checkout/${shopSessionId}/switching-assistant`,
  checkoutPaymentRedirectBase: ({ locale, shopSessionId }: CheckoutPaymentRedirectBasePage) =>
    `${ORIGIN_URL}/${locale}/checkout/${shopSessionId}/payment`,
  checkoutSign: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout/sign`,
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) =>
    `${localePrefix(locale)}/confirmation/${shopSessionId}`,

  apiPaymentAdyenCallback: ({ locale, shopSessionId }: AdyenCallbackRoute) =>
    `/api/payment/adyen-callback/${shopSessionId}/${locale}`,

  forever: ({ locale, code }: ForeverPage) => `${localePrefix(locale)}/forever/${code}`,

  customerService: ({ locale }: Required<BaseParams>) => {
    const url = CUSTOMER_SERVICE_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing support link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  deductibleHelp: ({ locale }: Required<BaseParams>) => {
    const url = DEDUCTIBLE_HELP_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing deductible info link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  apiSessionReset: () => '/api/session/reset',
  apiSessionCreate: (ssn: string) => `/api/session/create/?ssn=${ssn}`,
  apiCampaignAdd: ({ code, next }: CampaignAddRoute) => {
    const nextQueryParam = next ? `?next=${next}` : ''
    return `/api/campaign/add/${code}${nextQueryParam}`
  },
} as const

const CUSTOMER_SERVICE_URL: Partial<Record<RoutingLocale, string>> = {
  se: '/se/hjalp/kundservice',
  'en-se': '/se-en/help/customer-service',
}

const DEDUCTIBLE_HELP_URL: Partial<Record<RoutingLocale, string>> = {
  se: '/se/hjalp/sjalvrisk',
  'en-se': '/se-en/help/deductible',
}
