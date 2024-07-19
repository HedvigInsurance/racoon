import { datadogLogs } from '@datadog/browser-logs'
import { QueryParam as CheckoutPageQueryParam } from '@/components/CheckoutPage/CheckoutPage.constants'
import { QueryParam as CheckoutTrustlyQueryParam } from '@/components/CheckoutPaymentTrustlyPage/CheckoutPaymentTrustlyPage constants'
import type { RoutingLocale } from '@/utils/l10n/types'
import { ORIGIN_URL } from '@/utils/url'
import { locales } from './l10n/locales'

class ExtendedURL extends URL {
  constructor(url: string, base?: string) {
    super(url, base)
  }

  toRelative() {
    return this.pathname + this.search + this.hash
  }
}

type BaseParams = { locale: RoutingLocale }

type ConfirmationPage = BaseParams & { shopSessionId: string }
type CarDealershipConfirmationPage = BaseParams & { contractId: string }
type CheckoutPage = BaseParams & { expandCart?: boolean }
type CheckoutPaymentTrustlyPage = BaseParams & {
  shopSessionId: string
  nextUrl?: string
}
type AuthExchangeRoute = { authorizationCode: string; next?: string }
type RetargetingRoute = { shopSessionId: string }
type RetargetingApiRoute = { shopSessionId: string; locale: RoutingLocale }
type WidgetParams = BaseParams & {
  flow: string
  shopSessionId: string
  priceIntentId: string
}

type SessionLink = BaseParams & {
  shopSessionId: string
  // Relative URL to redirect to (default: home page)
  next?: string
  // Set a campaign code for the session
  code?: string
  // Resume the price intent and navigate to the related product page
  priceIntentId?: string
}

type MemberLoginPage = BaseParams & {
  next?: string
}

export const PageLink = {
  home: ({ locale }: BaseParams) => {
    if (locale === locales['sv-SE'].routingLocale) {
      return new URL('/', ORIGIN_URL)
    }
    return new URL(locale, ORIGIN_URL)
  },
  // TODO: we probably want a better setup for locale-specific slugs than just hardcoding them
  // and manually maintaining consistency between CMS and code
  store: ({ locale }: BaseParams) => {
    let slug = 'insurances'
    if (locale === 'se') {
      slug = 'forsakringar'
    }
    return new URL(`${locale}/${slug}`, ORIGIN_URL)
  },
  cart: ({ locale }: BaseParams) => {
    return new URL(`${locale}/cart`, ORIGIN_URL)
  },
  checkout: ({ locale, expandCart = false }: CheckoutPage) => {
    const url = new ExtendedURL(`${locale}/checkout`, ORIGIN_URL)

    if (expandCart) {
      url.searchParams.set(CheckoutPageQueryParam.ExpandCart, '1')
    }

    return url
  },
  newCheckout: ({ locale, expandCart = false }: CheckoutPage) => {
    const url = new ExtendedURL(`${locale}/new/checkout`, ORIGIN_URL)

    if (expandCart) {
      url.searchParams.set(CheckoutPageQueryParam.ExpandCart, '1')
    }

    return url
  },
  checkoutPaymentTrustly: ({ locale, shopSessionId, nextUrl }: CheckoutPaymentTrustlyPage) => {
    const pathname = `${locale}/checkout/${shopSessionId}/payment/trustly`
    const url = new URL(pathname, ORIGIN_URL)

    if (nextUrl) {
      url.searchParams.append(CheckoutTrustlyQueryParam.NextUrl, nextUrl)
    }

    return url
  },
  cookiesInfo: ({ locale }: BaseParams) => {
    return new URL(`${locale}/hedvig/cookies`, ORIGIN_URL)
  },
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) => {
    const pathname = `${locale}/confirmation/${shopSessionId}`
    return new URL(pathname, ORIGIN_URL)
  },
  carDealershipConfirmation: ({ locale, contractId }: CarDealershipConfirmationPage) => {
    const pathname = `${locale}/car-buyer/confirmation/${contractId}`
    return new URL(pathname, ORIGIN_URL)
  },

  faq: ({ locale }: { locale: RoutingLocale }) => {
    const url = FAQ_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing faq link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  help: ({ locale }: { locale: RoutingLocale }) => {
    const url = HELP_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing help page link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },
  emailUs: ({ locale }: { locale: RoutingLocale }) => {
    const url = EMAIL_US_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing email us link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  memberArea: ({ locale }: BaseParams) => {
    return new URL(`${locale}/member`, ORIGIN_URL)
  },
  memberAreaClaim: ({ locale }: BaseParams) => {
    return new URL(`${locale}/member/claim`, ORIGIN_URL)
  },
  memberAreaInsurances: ({ locale }: BaseParams) => {
    return new URL(`${locale}/member/insurances`, ORIGIN_URL)
  },
  memberAreaPayments: ({ locale }: BaseParams) => {
    return new URL(`${locale}/member/payments`, ORIGIN_URL)
  },
  memberAreaLogin: (params: MemberLoginPage) => {
    const url = new ExtendedURL(`${params.locale}/member/login`, ORIGIN_URL)

    if (params.next) {
      url.searchParams.set('next', params.next)
    }

    return url
  },

  paymentConnect: ({ locale }: BaseParams) => {
    return new URL(`${locale}/payment/connect`, ORIGIN_URL)
  },
  paymentConnectReady: ({ locale }: BaseParams) => {
    return new URL(`${locale}/payment/connect/ready`, ORIGIN_URL)
  },
  paymentConnectSuccess: ({ locale }: BaseParams) => {
    return new URL(`${locale}/payment/connect/success`, ORIGIN_URL)
  },

  paymentSuccess: ({ locale }: BaseParams) => {
    return new URL(`${locale}/payment-success`, ORIGIN_URL)
  },
  paymentFailure: ({ locale }: BaseParams) => {
    return new URL(`${locale}/payment-failure`, ORIGIN_URL)
  },

  customerService: ({ locale }: BaseParams) => {
    const url = CUSTOMER_SERVICE_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing support link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  deductibleHelp: ({ locale }: BaseParams) => {
    const url = DEDUCTIBLE_HELP_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing deductible info link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  privacyPolicy: ({ locale }: BaseParams) => {
    const url = PRIVACY_POLICY_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing privacy policy link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  reviews: ({ locale }: BaseParams) => {
    const url = REVIEWS_URL[locale]
    if (!url) {
      datadogLogs.logger.error('Missing reviews link for locale', { locale })
      return PageLink.home({ locale })
    }
    return url
  },

  apiSessionReset: ({ next }: { next?: string } = {}) => {
    const url = new URL('/api/session/reset', ORIGIN_URL)

    if (next) {
      url.searchParams.set('next', next)
    }

    return url
  },
  session: (params: SessionLink) => {
    const pathname = `${params.locale}/session/${params.shopSessionId}`
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

  paymentConnectLegacy: ({ locale }: BaseParams) => {
    return new URL(`/${locale}/payment/connect-legacy`, ORIGIN_URL)
  },
  apiAdyenCallback: ({ locale }: BaseParams) => {
    return new URL(`api/adyen-callback/${locale}`, ORIGIN_URL)
  },
  paymentConnectLegacySuccess: ({ locale }: BaseParams) => {
    return new URL(`/${locale}/payment/connect-legacy/success`, ORIGIN_URL)
  },
  paymentConnectLegacyError: ({ locale }: BaseParams) => {
    return new URL(`/${locale}/payment/connect-legacy/error`, ORIGIN_URL)
  },
  apiAuthExchange: ({ authorizationCode, next }: AuthExchangeRoute) => {
    const url = new URL(`/api/auth/exchange/${authorizationCode}`, ORIGIN_URL)

    if (next) {
      url.searchParams.set('next', next)
    }

    return url
  },

  retargeting: ({ locale, shopSessionId }: BaseParams & RetargetingRoute) => {
    const url = new URL(`${locale}/session/resume`, ORIGIN_URL)
    url.searchParams.set('shopSessionId', shopSessionId)
    return url
  },
  apiRetargeting: ({ shopSessionId, locale }: RetargetingApiRoute) => {
    const url = new URL(`/api/retargeting/${shopSessionId}`, ORIGIN_URL)
    url.searchParams.set('locale', locale)
    return url
  },

  apiAppStoreRedirect: () => {
    return new URL(`/api/redirect/appstore`, ORIGIN_URL)
  },

  fourOhFour: ({ locale }: BaseParams) => {
    return new URL(`${locale}/404`, ORIGIN_URL)
  },

  widgetSelectProduct: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [params.locale, 'widget/run', params.flow, params.shopSessionId, 'select'].join('/'),
      ORIGIN_URL,
    )
  },
  widgetCalculatePrice: (params: WidgetParams) => {
    return new URL(
      [
        params.locale,
        'widget/run',
        params.flow,
        params.shopSessionId,
        params.priceIntentId,
        'calculate-price',
      ].join('/'),
      ORIGIN_URL,
    )
  },
  widgetSwitch: (params: WidgetParams) => {
    return new URL(
      [
        params.locale,
        'widget/run',
        params.flow,
        params.shopSessionId,
        params.priceIntentId,
        'switch',
      ].join('/'),
      ORIGIN_URL,
    )
  },
  widgetSign: (params: WidgetParams) => {
    return new URL(
      [
        params.locale,
        'widget/run',
        params.flow,
        params.shopSessionId,
        params.priceIntentId,
        'sign',
      ].join('/'),
      ORIGIN_URL,
    )
  },
  widgetPayment: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [params.locale, 'widget/run', params.flow, params.shopSessionId, 'payment'].join('/'),
      ORIGIN_URL,
    )
  },
  widgetConfirmation: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [params.locale, 'widget/run', params.flow, params.shopSessionId, 'confirmation'].join('/'),
      ORIGIN_URL,
    )
  },

  forever: (params: BaseParams & { code: string }) => {
    return new URL(`${params.locale}/forever/${params.code}`, ORIGIN_URL)
  },
} as const

const CUSTOMER_SERVICE_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hjalp/kundservice', ORIGIN_URL),
  'se-en': new URL('/se-en/help/customer-service', ORIGIN_URL),
}

const FAQ_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hjalp/faq', ORIGIN_URL),
  'se-en': new URL('/se-en/help/faq', ORIGIN_URL),
}

const HELP_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hjalp', ORIGIN_URL),
  'se-en': new URL('/se-en/help', ORIGIN_URL),
}

const EMAIL_US_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hjalp/mejla-oss', ORIGIN_URL),
  'se-en': new URL('/se-en/help/email-us', ORIGIN_URL),
}

const DEDUCTIBLE_HELP_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/forsakringar/djurforsakring/sjalvrisk', ORIGIN_URL),
  'se-en': new URL('/se-en/insurances/pet-insurance/deductible', ORIGIN_URL),
}

const PRIVACY_POLICY_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hedvig/personuppgifter', ORIGIN_URL),
  'se-en': new URL('/se-en/hedvig/privacy-policy', ORIGIN_URL),
}

const REVIEWS_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hedvig/omdomen', ORIGIN_URL),
  'se-en': new URL('/se-en/hedvig/reviews', ORIGIN_URL),
}
