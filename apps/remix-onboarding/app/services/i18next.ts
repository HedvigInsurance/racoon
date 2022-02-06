import { Locale } from '~/lib/types'
import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'

export const supportedLngs: Array<Locale> = ['se', 'se-en', 'no', 'no-en', 'dk', 'dk-en']
export const fallbackLng = 'se-en'

export async function i18nextInit() {
  const i18n = createInstance()
  await i18n.use(initReactI18next).init({
    supportedLngs,
    fallbackLng,
    fallbackNS: 'common',
    defaultNS: 'common',
    keySeparator: false,
    nsSeparator: false,
    lowerCaseLng: true,
    interpolation: {
      prefix: '{',
      suffix: '}',
    },
    react: { useSuspense: false },
  })
  return i18n
}
