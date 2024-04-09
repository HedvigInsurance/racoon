import type { BackendModule, CallbackError, InitOptions, Resource } from 'i18next';
import { createInstance } from 'i18next'
import type { I18n } from 'next-i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import nextI18nextConfig from '../../next-i18next.config.cjs'

// Every i18n namespace must be added here in order to preload translations
// We may consider having multiple TranslationsProvider instances each with its own namespaces
// for optimization in the future
const allNamespaces = [
  'common',
  'bankid',
  'carDealership',
  'cart',
  'checkout',
  'contact-us',
  'memberArea',
  'purchase-form',
  'reviews',
  'widget',
]

const allLocales = ['en', 'dk-en', 'no-en', 'se-en', 'se', 'sv-se']

export const initTranslations = async (
  locale: string,
  i18nInstance?: I18n,
  resources?: Resource,
) => {
  const i18n = i18nInstance ?? createInstance()
  i18n.use(initReactI18next)
  if (resources === undefined) {
    i18n.use(requireTranslationsBackend)
  }

  const preload = [locale]
  if (Array.isArray(nextI18nextConfig.fallbackLng)) {
    const fallback = nextI18nextConfig.fallbackLng[locale as any]
    if (fallback != null) {
      preload.push(...fallback)
    }
  }
  const options: InitOptions = {
    lng: locale,
    ns: allNamespaces,
    supportedLngs: allLocales,
    preload: resources ? [] : preload,
    resources,
    ...nextI18nextConfig,
  }
  await i18n.init(options)

  return {
    i18n,
    resources: i18n.services.resourceStore.data,
    t: i18n.t,
  }
}

const requireTranslationsBackend: BackendModule = {
  type: 'backend',
  async read(language, namespace, callback) {
    try {
      const resource = await import(`../../public/locales/${language}/${namespace}.json`)
      callback(null, resource)
    } catch (err: unknown) {
      callback(err as CallbackError, null)
    }
  },
  init: () => {},
}

export const initTranslationsServerSide = (locale: string) => initTranslations(locale)
