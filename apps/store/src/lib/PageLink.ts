import { Locale } from './l10n/types'

type BaseParams = { locale?: Locale }

type ProductPage = BaseParams & { id: string }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, id }: ProductPage) => `${getOptionalPath(locale)}/products/${id}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  checkoutPayment: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/payment`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/confirmation`,
}
