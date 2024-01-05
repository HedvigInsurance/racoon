import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'

export const useDebugTranslationKeys = () => {
  const { query } = useRouter()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (query.debug === 'textkeys') {
      i18n.changeLanguage('cimode')
    } else if (query.debug === 'none') {
      i18n.changeLanguage()
    }
  }, [i18n, query.debug])
}
