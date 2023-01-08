import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import nextI18nextConfig from '../next-i18next.config'

const requireTranslationsBackend = {
  type: 'backend',
  read(language, namespace, callback) {
    import(`../public/locales/${language}/${namespace}.json`)
      .then((resources) => {
        callback(null, resources)
      })
      .catch((error) => {
        callback(error, null)
      })
  },
}

i18n
  .use(initReactI18next)
  .use(requireTranslationsBackend)
  .init({ ...nextI18nextConfig, lng: 'en', defaultNS: nextI18nextConfig.fallbackNS })
