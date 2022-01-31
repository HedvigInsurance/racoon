type BaseParams = { locale: string }

type ForeverParams = BaseParams & { code?: string }

export const PageLink = {
  forever: ({ code, locale }: ForeverParams) =>
    code ? `${locale}/forever/${code}` : `${locale}/forever`,
  landing: ({ locale }: BaseParams) => `${locale}/new-member`,
}
