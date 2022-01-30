import { Country, Language, Locale } from './types'

import { pick } from 'accept-language-parser'

/**
 * All available locales per recommendedCountryCode in the following format:
 * { [recommendedCountryCode code]: { [language code]: locale code } }
 */
export const locales: Record<Country, Partial<Record<Language, Locale>>> = {
  se: { sv: 'se', en: 'se-en' },
  no: { nb: 'no', en: 'no-en' },
  dk: { da: 'dk', en: 'dk-en' },
}

const _defaultFallbackLanguage: Language = 'en'
const _defaultFallbackLocale: Country = 'se'
const _computedLanguageCodes = Array.from(
  new Set<string>(
    Object.values(locales)
      .map((languages) => Object.keys(languages))
      .flat(),
  ),
)

const _computedLocales = Object.entries(locales)
  .map(([, languages]) => Object.values(languages).map((locale) => locale))
  .flat()

export const localesList = _computedLocales

function isLanguageCode(code: any): code is Language {
  return _computedLanguageCodes.includes(code)
}

/**
 * Get the recommended locale for a request using its `Accept-Language` header and IP address
 * @param headers - Request headers
 * @returns Locale, e.g., "en-ch"
 */
export const getRecommendedLocale = (headers: Headers): string => {
  const recommendedLanguageCode = pick(_computedLanguageCodes, headers.get('accept-language') ?? '')
  const recommendedCountryCode: Country = 'se'

  const language = isLanguageCode(recommendedLanguageCode)
    ? recommendedLanguageCode
    : _defaultFallbackLanguage
  return locales[recommendedCountryCode][language] ?? _defaultFallbackLocale
}
