import { LocaleLabel } from './l10n/locales'

type BaseParams = { locale?: LocaleLabel | string }

type ForeverParams = BaseParams & { code: string }
type WOCheckoutParams = Required<BaseParams> & { quoteCartId: string }
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
}
