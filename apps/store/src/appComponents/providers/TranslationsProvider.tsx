'use client'

import type { Resource } from 'i18next'
import { createInstance } from 'i18next'
import type { I18n } from 'next-i18next'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { initTranslations } from '@/app/i18n'
import type { RoutingLocale } from '@/utils/l10n/types'

type Props = {
  children: ReactNode
  locale: RoutingLocale
  resources?: Resource
}

export const TranslationsProvider = ({ children, locale, resources }: Props) => {
  const i18nRef = useRef<I18n>()
  if (i18nRef.current == null) {
    i18nRef.current = createInstance()
    initTranslations(locale, { i18nInstance: i18nRef.current, resources })
  }

  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>
}
