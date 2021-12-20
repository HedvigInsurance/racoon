import { LOCALE_URL_PARAMS, LocaleUrlParams } from './locales'

export const PARAM_PLACEHOLDER = 'locale'

export const getLocalePathPattern = (
  permittedLocaleUrlParams: LocaleUrlParams,
) => {
  return `/:${PARAM_PLACEHOLDER}(${permittedLocaleUrlParams.join('|')})`
}

export const localePathPattern = getLocalePathPattern(LOCALE_URL_PARAMS)
