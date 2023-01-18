import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { RoutingLocale } from '@/utils/l10n/types'

export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ??
  (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040')

type BaseParams = { locale?: RoutingLocale }

type ProductPage = BaseParams & { slug: string }
type CheckoutPaymentPage = BaseParams & { shopSessionId: string; authStatus?: AuthStatus }
type CheckoutPaymentRedirectBasePage = Required<BaseParams> & { shopSessionId: string }
type AdyenCallbackRoute = Required<BaseParams> & { shopSessionId: string }
type ConfirmationPage = BaseParams & { shopSessionId: string }

// We need explicit locale when doing server-side redirects.  On client side NextJs adds it automatically
const localePrefix = (locale?: RoutingLocale) => (locale ? `/${locale}` : '')

export const PageLink = {
  home: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}`,
  store: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${localePrefix(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout`,
  checkoutPayment: ({ locale, authStatus, shopSessionId }: CheckoutPaymentPage) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${localePrefix(locale)}/checkout/${shopSessionId}/payment${queryString}`
  },
  checkoutPaymentRedirectBase: ({ locale, shopSessionId }: CheckoutPaymentRedirectBasePage) =>
    `${ORIGIN_URL}/${locale}/checkout/${shopSessionId}/payment`,
  checkoutSign: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout/sign`,
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) =>
    `${localePrefix(locale)}/confirmation/${shopSessionId}`,

  apiPaymentAdyenCallback: ({ locale, shopSessionId }: AdyenCallbackRoute) =>
    `/api/payment/adyen-callback/${shopSessionId}/${locale}`,

  apiLoginSe: () => `/api/auth/login/se`,
  apiSessionReset: () => '/api/session/reset',
  apiSessionCreate: (ssn: string) => `/api/session/create/?ssn=${ssn}`,
} as const
