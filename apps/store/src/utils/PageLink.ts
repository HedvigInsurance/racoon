import { datadogLogs } from '@datadog/browser-logs'
import { QueryParam as CheckoutPageQueryParam } from '@/components/CheckoutPage/CheckoutPage.constants'
import { QueryParam as CheckoutTrustlyQueryParam } from '@/components/CheckoutPaymentTrustlyPage/CheckoutPaymentTrustlyPage constants'
import { RoutingLocale } from '@/utils/l10n/types'

class ExtendedURL extends URL {
  constructor(url: string, base?: string) {
    super(url, base)
  }

  toRelative() {
    return this.pathname + this.search + this.hash
  }
}

export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040')

type BaseParams = { locale?: RoutingLocale }

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
type WidgetSignParams = Omit<WidgetParams, 'priceIntentId'>

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
    const url = new ExtendedURL(`${localePrefix(locale)}/checkout`, ORIGIN_URL)

    if (expandCart) {
      url.searchParams.set(CheckoutPageQueryParam.ExpandCart, '1')
    }

    return url
  },
  checkoutPaymentTrustly: ({ locale, shopSessionId, nextUrl }: CheckoutPaymentTrustlyPage) => {
    const pathname = `${localePrefix(locale)}/checkout/${shopSessionId}/payment/trustly`
    const url = new URL(pathname, ORIGIN_URL)

    if (nextUrl) {
      url.searchParams.append(CheckoutTrustlyQueryParam.NextUrl, nextUrl)
    }

    return url
  },
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) => {
    const pathname = `${localePrefix(locale)}/confirmation/${shopSessionId}`
    return new URL(pathname, ORIGIN_URL)
  },
  carDealershipConfirmationWithExtension: ({
    locale,
    contractId,
  }: CarDealershipConfirmationPage) => {
    const pathname = `${localePrefix(locale)}/car-buyer/confirmation-with-extension/${contractId}`
    return new URL(pathname, ORIGIN_URL)
  },
  carDealershipConfirmationWithoutExtension: ({
    locale,
    contractId,
  }: CarDealershipConfirmationPage) => {
    const pathname = `${localePrefix(
      locale,
    )}/car-buyer/confirmation-without-extension/${contractId}`
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

  memberArea: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/member`, ORIGIN_URL)
  },
  memberAreaClaim: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/member/claim`, ORIGIN_URL)
  },
  memberAreaInsurances: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/member/insurances`, ORIGIN_URL)
  },
  memberAreaPayments: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/member/payments`, ORIGIN_URL)
  },
  memberAreaLogin: (params: MemberLoginPage = {}) => {
    const url = new ExtendedURL(`${localePrefix(params.locale)}/member/login`, ORIGIN_URL)

    if (params.next) {
      url.searchParams.set('next', params.next)
    }

    return url
  },

  paymentConnect: (params?: BaseParams) => {
    return new URL(`${localePrefix(params?.locale)}/payment/connect`, ORIGIN_URL)
  },
  paymentConnectReady: (params?: BaseParams) => {
    return new URL(`${localePrefix(params?.locale)}/payment/connect/ready`, ORIGIN_URL)
  },
  paymentConnectSuccess: (params?: BaseParams) => {
    return new URL(`${localePrefix(params?.locale)}/payment/connect/success`, ORIGIN_URL)
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
  apiSessionCreate: (ssn: string) => {
    return new URL(`/api/session/create/?ssn=${ssn}`, ORIGIN_URL)
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

  paymentConnectLegacy: ({ locale }: Required<BaseParams>) => {
    return new URL(`/${locale}/payment/connect-legacy`, ORIGIN_URL)
  },
  apiAdyenCallback: ({ locale }: Required<BaseParams>) => {
    return new URL(`api/adyen-callback/${locale}`, ORIGIN_URL)
  },
  paymentConnectLegacySuccess: ({ locale }: Required<BaseParams>) => {
    return new URL(`/${locale}/payment/connect-legacy/success`, ORIGIN_URL)
  },
  paymentConnectLegacyError: ({ locale }: Required<BaseParams>) => {
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
    const url = new URL(`${localePrefix(locale)}/session/resume`, ORIGIN_URL)
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
  fourOhFour: ({ locale }: BaseParams = {}) => {
    return new URL(`${localePrefix(locale)}/404`, ORIGIN_URL)
  },

  widgetSelectProduct: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [localePrefix(params.locale), 'widget', params.flow, params.shopSessionId, 'select'].join(
        '/',
      ),
      ORIGIN_URL,
    )
  },
  widgetCalculatePrice: (params: WidgetParams) => {
    return new URL(
      [
        localePrefix(params.locale),
        'widget',
        params.flow,
        params.shopSessionId,
        params.priceIntentId,
        'calculate-price',
      ].join('/'),
      ORIGIN_URL,
    )
  },
  widgetSign: (params: WidgetSignParams) => {
    return new URL(
      [localePrefix(params.locale), 'widget', params.flow, params.shopSessionId, 'sign'].join('/'),
    )
  },
  widgetPayment: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [localePrefix(params.locale), 'widget', params.flow, params.shopSessionId, 'payment'].join(
        '/',
      ),
      ORIGIN_URL,
    )
  },
  widgetConfirmation: (params: Omit<WidgetParams, 'priceIntentId'>) => {
    return new URL(
      [
        localePrefix(params.locale),
        'widget',
        params.flow,
        params.shopSessionId,
        'confirmation',
      ].join('/'),
      ORIGIN_URL,
    )
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

const DEDUCTIBLE_HELP_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/forsakringar/djurforsakring/sjalvrisk', ORIGIN_URL),
  'se-en': new URL('/se-en/insurances/pet-insurance/deductible', ORIGIN_URL),
}

const PRIVACY_POLICY_URL: Partial<Record<RoutingLocale, URL>> = {
  se: new URL('/se/hedvig/personuppgifter', ORIGIN_URL),
  'se-en': new URL('/se-en/hedvig/privacy-policy', ORIGIN_URL),
}
