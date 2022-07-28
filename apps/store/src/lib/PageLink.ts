import { Locale } from './l10n/types'

type BaseParams = { locale?: Locale }

type ProductPage = BaseParams & { slug: string }
type PriceProductAPI = { productSlug: string; intent?: 'confirm' | 'update' }
type CartLinesAPI = { lineId: string }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${getOptionalPath(locale)}/products/${slug}`,
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
  apiPriceProduct: ({ productSlug, intent }: PriceProductAPI) =>
    `/api/price/${productSlug}?intent=${intent ?? 'update'}`,
  apiCartLinesAdd: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/add`,
  apiCartLinesRemove: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/remove`,
}
