import { Language } from 'remix-i18next'
import { marked } from 'marked'

type Translation = Record<string, Language>

export const replaceMarkdown = async (translations: Translation, fields: Array<string>) => {
  const { JSDOM } = await import('jsdom')
  const createDOMPurify = (await import('dompurify')).default

  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window as unknown as Window)

  for (const markdownField of fields) {
    const markdownSource = translations.common[markdownField]
    if (typeof markdownSource === 'string') {
      translations.common[markdownField] = DOMPurify.sanitize(marked(markdownSource))
    }
  }

  return translations
}
