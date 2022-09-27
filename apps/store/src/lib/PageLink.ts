import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { LocaleValue, RoutingLocale } from './l10n/types'

type BaseParams = { locale?: LocaleValue | RoutingLocale }

type ProductPage = BaseParams & { slug: string }
type CheckoutPaymentPage = BaseParams & { authStatus?: AuthStatus }

const getOptionalPath = (segment?: string) => (segment ? `/${segment.toLowerCase()}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${getOptionalPath(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  checkoutContactDetails: ({ locale }: BaseParams = {}) =>
    `${getOptionalPath(locale)}/checkout/contact-details`,
  checkoutPayment: ({ locale, authStatus }: CheckoutPaymentPage = {}) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${getOptionalPath(locale)}/checkout/payment${queryString}`
  },
  checkoutSign: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/sign`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/confirmation`,

  apiPaymentAdyenCallback: ({ locale }: Required<BaseParams>) =>
    `/api/payment/adyen-callback/${locale}`,
}
