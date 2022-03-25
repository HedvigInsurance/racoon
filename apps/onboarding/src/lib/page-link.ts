import { LocaleLabel } from './l10n/locales'

const WEB_ONBOARDING_URL = process.env.NEXT_PUBLIC_WEB_ONBOARDING_URL

type BaseParams = { locale?: LocaleLabel | string }

type ForeverParams = BaseParams & { code: string }
type WOCheckoutParams = Required<BaseParams> & { quoteCartId: string }
type CartParams = BaseParams & { quoteCartId: string; types?: Array<string> }
type WOOfferParams = CartParams & { showEdit?: boolean }

const getOptionalPath = (segment?: string) => (segment ? `/${segment}` : '')

export const PageLink = {
  forever: ({ locale, code }: Partial<ForeverParams> = {}) =>
    `${getOptionalPath(locale)}/forever${getOptionalPath(code)}`,
  foreverReady: ({ locale, code }: ForeverParams) =>
    `${getOptionalPath(locale)}/forever/${code}/ready`,
  landing: ({ locale }: BaseParams = {}) => `${getOptionalPath(locale)}/landing`,
  old_checkout: ({ locale, quoteCartId }: WOCheckoutParams) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/sign/${quoteCartId}`,
  embark: ({ locale }: BaseParams) => `${WEB_ONBOARDING_URL}/${locale}/new-member/new`,
  privacy_policy: ({ locale }: BaseParams) => `${WEB_ONBOARDING_URL}/${locale}/privacy-policy`,
  cart: ({ locale, quoteCartId, types = [] }: CartParams) => {
    const searchParams = new URLSearchParams()
    for (const insuranceType of types) {
      searchParams.append('type', insuranceType)
    }
    return `${getOptionalPath(locale)}/new-member/cart/${quoteCartId}?${searchParams.toString()}`
  },
  old_onboarding_se_needer: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-accident-needer`,
  old_onboarding_se_switcher: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-switcher`,
  old_landing_page: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member`,
  old_offer: ({ locale, quoteCartId, showEdit = false }: WOOfferParams) => {
    const searchParams = new URLSearchParams()
    if (showEdit) searchParams.append('showEdit', 'true')
    return `${WEB_ONBOARDING_URL}/${locale}/new-member/offer/${quoteCartId}?${searchParams.toString()}`
  },
}
