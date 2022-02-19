import type { SSRConfig } from 'next-i18next'
import { marked } from 'marked'

export const replaceMarkdown = async (translations: SSRConfig, fields: Array<string>) => {
  const { JSDOM } = await import('jsdom')
  const createDOMPurify = (await import('dompurify')).default

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window as unknown as Window)

  for (const localeKey of Object.keys(translations._nextI18Next.initialI18nStore)) {
    const localeTranslations = translations._nextI18Next.initialI18nStore[localeKey].common
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
