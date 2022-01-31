import { fallbackLng, supportedLngs } from '~/services/i18next'

import { FileSystemBackend } from 'remix-i18next'
import { RemixI18Next } from 'remix-i18next'

const backend = new FileSystemBackend('./public/locales')

export const i18n = new RemixI18Next(backend, {
  fallbackLng,
  supportedLanguages: supportedLngs,
})
