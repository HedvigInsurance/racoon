import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { RoutingLocale } from '@/utils/l10n/types'

export const ORIGIN_URL =
  process.env.NEXT_PUBLIC_ORIGIN_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:8040'

type BaseParams = { locale?: RoutingLocale }

type ProductPage = BaseParams & { slug: string }
type CheckoutPaymentPage = BaseParams & { authStatus?: AuthStatus }
type ConfirmationPage = BaseParams & { shopSessionId: string }

// We need explicit locale when doing server-side redirects.  On client side NextJs adds it automatically
const localePrefix = (locale?: RoutingLocale) => (locale ? `/${locale}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${localePrefix(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout`,
  checkoutPayment: ({ locale, authStatus }: CheckoutPaymentPage = {}) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${localePrefix(locale)}/checkout/payment${queryString}`
  },
  checkoutPaymentRedirectBase: ({ locale }: Required<BaseParams>) =>
    `${ORIGIN_URL}/${locale}/checkout/payment`,
  checkoutSign: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout/sign`,
  confirmation: ({ locale, shopSessionId }: ConfirmationPage) =>
    `${localePrefix(locale)}/confirmation/${shopSessionId}`,

  apiPaymentAdyenCallback: ({ locale }: Required<BaseParams>) =>
    `/api/payment/adyen-callback/${locale}`,
} as const
