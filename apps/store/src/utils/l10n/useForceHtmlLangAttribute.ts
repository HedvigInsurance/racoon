import { useEffect } from 'react'
import { useCurrentLocale } from './useCurrentLocale'

export const useForceHtmlLangAttribute = () => {
  const { htmlLang } = useCurrentLocale()

  useEffect(() => {
    document.documentElement.lang = htmlLang

    const langObserver = new MutationObserver(() => {
      if (document.documentElement.lang !== htmlLang) {
        document.documentElement.lang = htmlLang
      }
    })

    langObserver.observe(document.documentElement, {
      attributeFilter: ['lang'],
    })

    return () => {
      langObserver.disconnect()
    }
  }, [htmlLang])
}
