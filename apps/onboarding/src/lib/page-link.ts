import { LocaleLabel } from './l10n/locales'

type BaseParams = { locale?: LocaleLabel | string }

type ForeverParams = BaseParams & { code: string }

export const PageLink = {
  forever: ({ locale, code }: Partial<ForeverParams> = {}) =>
    `/${locale ?? ''}/forever${code ? `/${code}` : ''}`,
  foreverReady: ({ locale, code }: ForeverParams) => `/${locale ?? ''}/forever/${code}/ready`,
  landing: ({ locale }: BaseParams = {}) => `/${locale ?? ''}/landing`,
}
