import { LocaleLabel } from './l10n/locales'

const WEB_ONBOARDING_URL = process.env.NEXT_PUBLIC_WEB_ONBOARDING_URL

type BaseParams = { locale?: LocaleLabel | string }

type ForeverParams = BaseParams & { code: string }
type ProductPage = BaseParams & { id: string }
type WOCheckoutParams = Required<BaseParams> & { quoteCartId: string }
type EmbarkParams = BaseParams & { slug?: string }
type WOOfferParams = Required<BaseParams> & { quoteCartId: string; showEdit?: boolean }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  forever: ({ locale, code }: Partial<ForeverParams> = {}) =>
    `${getOptionalPath(locale)}/forever${getOptionalPath(code)}`,
  foreverReady: ({ locale, code }: ForeverParams) =>
    `${getOptionalPath(locale)}/forever/${code}/ready`,
  landing: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/new-member`,

  store: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/store`,
  product: ({ locale, id }: ProductPage) => `${getOptionalPath(locale)}/products/${id}`,
  cart: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/cart`,
  checkout: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout`,
  confirmation: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/checkout/confirmation`,

  old_checkout: ({ locale, quoteCartId }: WOCheckoutParams) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/sign/${quoteCartId}`,
  embark: ({ locale, slug }: EmbarkParams) => `${WEB_ONBOARDING_URL}/${locale}/new-member/${slug}`,
  privacy_policy: ({ locale }: BaseParams) => `${WEB_ONBOARDING_URL}/${locale}/privacy-policy`,
  old_onboarding_se_needer: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-accident-needer`,
  old_onboarding_se_switcher: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-switcher`,
  old_landing_page: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member`,
  old_offer: ({ locale, quoteCartId, showEdit }: WOOfferParams) => {
    const baseURL = `${WEB_ONBOARDING_URL}/${locale}/new-member/offer/${quoteCartId}`

    if (showEdit) {
      const searchParams = new URLSearchParams()
      searchParams.append('showEdit', 'true')
      return `${baseURL}?${searchParams.toString()}`
    }

    return baseURL
  },

  startFormApi: () => '/api/pages/start',
  debuggerFormApi: () => '/api/pages/debugger',
}
