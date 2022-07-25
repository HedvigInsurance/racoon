import { Locale } from './l10n/types'

type BaseParams = { locale?: Locale }

type ProductPage = BaseParams & { id: string }
type PriceProductAPI = { productId: string; intent?: 'confirm' | 'update' }
type CartLinesAPI = { lineId: string }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, id }: ProductPage) => `${getOptionalPath(locale)}/products/${id}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  cartReview: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart/review`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  checkoutPaymentAdyen: ({ locale }: BaseParams = {}) =>
    `${getOptionalPath(locale)}/checkout/payment/adyen`,
  checkoutPaymentUpdate: ({ locale }: BaseParams = {}) =>
    `${getOptionalPath(locale)}/checkout/payment/update`,
  checkoutSign: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/sign`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/confirmation`,

  apiCheckoutCreate: () => '/api/checkout',
  apiCheckoutPersonCreate: () => '/api/checkout/person',
  apiCheckoutPersonSign: () => '/api/checkout/person-sign',
  apiCheckoutPaymentSign: () => '/api/checkout/payment-sign',
  apiPriceProduct: ({ productId, intent }: PriceProductAPI) =>
    `/api/price/${productId}?intent=${intent ?? 'update'}`,
  apiCartLinesAdd: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/add`,
  apiCartLinesRemove: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/remove`,
}
