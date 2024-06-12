import type { BackendModule, CallbackError, InitOptions, Resource } from 'i18next'
import { createInstance } from 'i18next'
import type { I18n } from 'next-i18next'
import { initReactI18next } from 'react-i18next/initReactI18next'
import nextI18nextConfig from '../../next-i18next.config.cjs'
import type { I18nNamespaces } from '../@types/i18next'

// Every i18n namespace must be added here in order to preload translations
// We may consider having multiple TranslationsProvider instances each with its own namespaces
// for optimization in the future
const allNamespaces: ReadonlyArray<keyof I18nNamespaces> = [
  'common',
  'bankid',
  'carDealership',
  'cart',
  'checkout',
  'contact-us',
  'contractSwitchConfirmationForm',
  'cookieConsent',
  'memberArea',
  'purchase-form',
  'reviews',
  'widget',
]

const allLocales = ['en', 'dk', 'dk-en', 'no', 'no-en', 'se-en', 'se', 'sv-se'] as const

type Options = {
  i18nInstance?: I18n
  resources?: Resource
  ns?: ReadonlyArray<keyof I18nNamespaces>
}

export const initTranslations = async (
  locale: string,
  { i18nInstance, resources, ns }: Options = {},
) => {
  const i18n = i18nInstance ?? createInstance()
  i18n.use(initReactI18next)
  if (resources == null) {
    i18n.use(importBackend)
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
    ns: ns ?? allNamespaces,
    supportedLngs: allLocales,
    preload: [],
    resources,
    // It's a safe default when result it not fed into `dangerouslySetInnerHTML` which we currently never do
    interpolation: { escapeValue: false },
    // We almost always provide translations in advance, no need to wait for their load client-side
    // https://react.i18next.com/latest/usetranslation-hook#not-using-suspense
    // Also, turning it to true on 404 page leads to endless loop when initializing
    react: { useSuspense: false },
    ...nextI18nextConfig,
  }
  await i18n.init(options)

  return {
    i18n,
    resources: i18n.services.resourceStore.data,
    t: i18n.t,
  }
}

const importBackend: BackendModule = {
  type: 'backend',
  async read(language, namespace, callback) {
    try {
      const resourceModule = await import(`../../public/locales/${language}/${namespace}.json`)
      // GOTCHA: resourceModule exposes both `default` and name exports for top-level keys
      // If we pass it down completely, we double JSON size that is transferred to client component tree
      callback(null, resourceModule.default)
    } catch (err: unknown) {
      if (typeof err === 'object' && (err as any).code === 'MODULE_NOT_FOUND') {
        // When loading translations client-side, we may miss some namespaces in fallback languages. This is safe to ignore
        // console.log(`Translation module not found, lang=${language} ns=${namespace}`)
        callback(null, {})
      } else {
        callback(err as CallbackError, null)
      }
    }
  },
  init: () => {},
}
