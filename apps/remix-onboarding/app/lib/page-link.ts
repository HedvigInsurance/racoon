import { Locale } from './types'

type BaseParams = { locale: Locale }

type ForeverParams = BaseParams & { code?: string }

export const PageLink = {
  forever: ({ code, locale }: ForeverParams) =>
    code ? `${locale}/forever/${code}` : `${locale}/forever`,
  landing: ({ locale }: BaseParams) => `${locale}/new-member`,
}
