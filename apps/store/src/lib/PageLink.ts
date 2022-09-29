import { AuthStatus } from '@/components/CheckoutPaymentPage/CheckoutPaymentPage.constants'
import { routingLocale } from '@/lib/l10n/locales'
import { UiLocale } from '@/lib/l10n/types'

type BaseParams = { locale?: UiLocale }

type ProductPage = BaseParams & { slug: string }
type CheckoutPaymentPage = BaseParams & { authStatus?: AuthStatus }

const localePrefix = (locale?: UiLocale) => (locale ? `/${routingLocale(locale)}` : '')

// TODO: Check if nextjs would add locales for us automatically
export const PageLink = {
  store: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/store`,
  product: ({ locale, slug }: ProductPage) => `${localePrefix(locale)}/products/${slug}`,
  cart: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout`,
  checkoutContactDetails: ({ locale }: BaseParams = {}) =>
    `${localePrefix(locale)}/checkout/contact-details`,
  checkoutPayment: ({ locale, authStatus }: CheckoutPaymentPage = {}) => {
    const authStatusQueryParam = authStatus ? `authStatus=${authStatus}` : null
    const queryString = authStatusQueryParam ? `?${authStatusQueryParam}` : ''
    return `${localePrefix(locale)}/checkout/payment${queryString}`
  },
  checkoutSign: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/checkout/sign`,
  confirmation: ({ locale }: BaseParams = {}) => `${localePrefix(locale)}/confirmation`,

  apiPaymentAdyenCallback: ({ locale }: Required<BaseParams>) =>
    `/api/payment/adyen-callback/${locale}`,
}
