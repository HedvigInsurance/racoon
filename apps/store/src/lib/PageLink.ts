import { Locale } from './l10n/types'

type BaseParams = { locale?: Locale }

type ProductPage = BaseParams & { slug: string }
type PriceProductAPI = { productSlug: string; formTemplateId: string }
type CartLinesAPI = { lineId: string }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${getOptionalPath(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  cartReview: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart/review`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  checkoutPayment: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/payment`,
  checkoutSign: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/sign`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/confirmation`,

  apiPriceProduct: ({ productSlug, formTemplateId }: PriceProductAPI) =>
    `/api/price/${productSlug}/${formTemplateId}`,
  apiCartLinesAdd: ({ lineId }: CartLinesAPI) => `/api/cart/${lineId}/add`,
}
