import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { Locale } from './l10n/types'

type BaseParams = { locale?: Locale }

type ProductPage = BaseParams & { slug: string }
type PriceProductAPI = { productSlug: string; formTemplateId: string }
type CartLinesAPI = { lineId: string }
type CheckoutPaymentPage = BaseParams & { authStatus?: AuthStatus }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${getOptionalPath(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  cartReview: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart/review`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  checkoutPayment: ({ locale, authStatus }: CheckoutPaymentPage = {}) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${getOptionalPath(locale)}/checkout/payment${queryString}`
  },
  checkoutSign: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/sign`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/confirmation`,

  apiPriceProduct: ({ productSlug, formTemplateId }: PriceProductAPI) =>
    `/api/price/${productSlug}/${formTemplateId}`,
  apiCartLinesAdd: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/add`,
  apiPaymentAdyenCallback: ({ locale }: Required<BaseParams>) =>
    `/api/payment/adyen-callback/${locale}`,
}
