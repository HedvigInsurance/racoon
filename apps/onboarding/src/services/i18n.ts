import { marked } from 'marked'
import type { SSRConfig } from 'next-i18next'

export const replaceMarkdown = async (translations: SSRConfig, fields: Array<string>) => {
  const { JSDOM } = await import('jsdom')
  const createDOMPurify = (await import('dompurify')).default

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window as unknown as Window)

  const store = translations._nextI18Next?.initialI18nStore
  if (typeof store == 'undefined') {
    throw new Error('Translation store not found or initialized')
  }

  for (const localeKey of Object.keys(store)) {
    const localeTranslations = store[localeKey].common
    for (const markdownField of fields) {
      if (localeTranslations[markdownField]) {
        localeTranslations[markdownField] = DOMPurify.sanitize(
          marked(localeTranslations[markdownField]),
        )
      }
    }
  }

  return translations
}
