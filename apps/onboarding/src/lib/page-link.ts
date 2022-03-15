import { LocaleLabel } from './l10n/locales'

type BaseParams = { locale?: LocaleLabel | string }

type ForeverParams = BaseParams & { code: string }
type WOCheckoutParams = Required<BaseParams> & { quoteCartId: string }
type CartParams = BaseParams & { quoteCartId: string }
const WEB_ONBOARDING_URL = process.env.NEXT_PUBLIC_WEB_ONBOARDING_URL

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
  cart: ({ locale, quoteCartId }: CartParams) =>
    `${getOptionalPath(locale)}/new-member/cart/${quoteCartId}`,
  old_onboarding_se_needer: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-accident-needer`,
  old_onboarding_se_switcher: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/home-switcher`,
  old_offer: ({ locale, quoteCartId }: Required<CartParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member/offer/${quoteCartId}`,
  old_landing_page: ({ locale }: Required<BaseParams>) =>
    `${WEB_ONBOARDING_URL}/${locale}/new-member`,
}
