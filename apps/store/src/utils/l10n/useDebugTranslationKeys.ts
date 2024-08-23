'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'

export function useDebugTranslationKeys() {
  const searchParams = useSearchParams()
  const { i18n } = useTranslation()

  const debugQueryParam = searchParams?.get('debug')

  useEffect(() => {
    if (debugQueryParam === 'textkeys') {
      i18n.changeLanguage('cimode')
    } else if (debugQueryParam === 'none') {
      i18n.changeLanguage()
    }
  }, [i18n, debugQueryParam])
}
