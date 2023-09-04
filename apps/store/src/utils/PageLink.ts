import { datadogLogs } from '@datadog/browser-logs'
import { QueryParam } from '@/components/CheckoutPage/CheckoutPage.constants'
import { RoutingLocale } from '@/utils/l10n/types'

export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040')

type BaseParams = { locale?: RoutingLocale }

type ConfirmationPage = BaseParams & { shopSessionId: string }
type CheckoutPage = BaseParams & { expandCart?: boolean }
type CampaignAddRoute = { code: string; next?: string }
type CheckoutPaymentTrustlyPage = BaseParams & { shopSessionId: string }
type AuthExchangeRoute = { authorizationCode: string; next?: string }
type RetargetingRoute = { shopSessionId: string }

type SessionLink = BaseParams & {
  shopSessionId: string
  // Relative URL to redirect to (default: home page)
  next?: string
  // Set a campaign code for the session
  code?: string
  // Resume the price intent and navigate to the related product page
  priceIntentId?: string
}

// We need explicit locale when doing server-side redirects.  On client side NextJs adds it automatically
const localePrefix = (locale?: RoutingLocale) => (locale ? `/${locale}` : '')

export const PageLink = {
  home: ({ locale }: BaseParams = {}) => {
    const pathname = localePrefix(locale) || '/'
    return new URL(pathname, ORIGIN_URL)
  },
  // TODO: we probably want a better setup for locale-specific slugs than just hardcoding them
  // and manually maintaining consistency between CMS and code
  store: ({ locale }: Required<BaseParams>) => {
    let slug = 'insurances'
    if (locale === 'se') {
      slug = 'forsakringar'
    }
    return new URL(`${localePrefix(locale)}/${slug}`, ORIGIN_URL)
  },
  cart: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/cart`, ORIGIN_URL)
  },
  checkout: ({ locale, expandCart = false }: CheckoutPage = {}) => {
    const url = new URL(`${localePrefix(locale)}/checkout`, ORIGIN_URL)

    if (expandCart) {
      url.searchParams.set(QueryParam.ExpandCart, '1')
    }

    return url
  },
  checkoutPaymentTrustly: ({ locale, shopSessionId }: CheckoutPaymentTrustlyPage) => {
    const pathname = `${localePrefix(locale)}/checkout/${shopSessionId}/payment/trustly`
    return new URL(pathname, ORIGIN_URL)
  },
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) => {
    const pathname = `${localePrefix(locale)}/confirmation/${shopSessionId}`
    return new URL(pathname, ORIGIN_URL)
  },
  paymentSuccess: ({ locale }: Required<BaseParams>) => {
    return new URL(`${locale}/payment-success`, ORIGIN_URL)
  },
  paymentFailure: ({ locale }: Required<BaseParams>) => {
    return new URL(`${locale}/payment-failure`, ORIGIN_URL)
  },

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

  privacyPolicy: ({ locale }: Required<BaseParams>) => {
    const url = PRIVACY_POLICY_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing privacy policy link for locale', { locale })
      return PageLink.home({ locale }).toString()
    }
    return url
  },

  apiSessionReset: ({ next }: { next?: string } = {}) => {
    const nextQueryParam = next ? `?next=${next}` : ''
    return `/api/session/reset${nextQueryParam}`
  },
  apiSessionCreate: (ssn: string) => `/api/session/create/?ssn=${ssn}`,
  apiCampaign: ({ code, next }: CampaignAddRoute) => {
    const nextQueryParam = next ? `?next=${next}` : ''
    return `/api/campaign/${code}${nextQueryParam}`
  },

  session: (params: SessionLink) => {
    const pathname = `${localePrefix(params.locale)}/session/${params.shopSessionId}`
    const url = new URL(pathname, ORIGIN_URL)

    if (params.code) {
      url.searchParams.set('code', params.code)
    }

    if (params.priceIntentId) {
      url.searchParams.set('price_intent_id', params.priceIntentId)
    } else if (params.next) {
      url.searchParams.set('next', params.next)
    }

    return url
  },

  paymentConnectLegacy: ({ locale }: Required<BaseParams>) => `/${locale}/payment/connect-legacy`,
  apiAdyenCallback: ({ locale }: Required<BaseParams>) =>
    `${ORIGIN_URL}/api/adyen-callback/${locale}`,
  paymentConnectLegacySuccess: ({ locale }: Required<BaseParams>) =>
    `/${locale}/payment/connect-legacy/success`,
  paymentConnectLegacyError: ({ locale }: Required<BaseParams>) =>
    `/${locale}/payment/connect-legacy/error`,
  apiAuthExchange: ({ authorizationCode, next }: AuthExchangeRoute) => {
    const nextQueryParam = next ? `?next=${next}` : ''
    return `/api/auth/exchange/${authorizationCode}${nextQueryParam}`
  },

  retargeting: ({ locale, shopSessionId }: BaseParams & RetargetingRoute) => {
    const url = new URL(`${localePrefix(locale)}/session/resume`, ORIGIN_URL)
    url.searchParams.set('shopSessionId', shopSessionId)
    return url
  },
  apiRetargeting: ({ shopSessionId }: RetargetingRoute) => `/api/retargeting/${shopSessionId}`,
} as const

const CUSTOMER_SERVICE_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hjalp/kundservice', ORIGIN_URL),
  'se-en': new URL('/se-en/help/customer-service', ORIGIN_URL),
}

const DEDUCTIBLE_HELP_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/forsakringar/djurforsakring/sjalvrisk', ORIGIN_URL),
  'se-en': new URL('/se-en/insurances/pet-insurance/deductible', ORIGIN_URL),
}

const PRIVACY_POLICY_URL: Partial<Record<RoutingLocale, string>> = {
  se: '/se/hedvig/personuppgifter',
  'se-en': '/se-en/hedvig/privacy-policy',
}
