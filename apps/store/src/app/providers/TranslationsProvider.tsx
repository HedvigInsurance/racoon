'use client'

import { createInstance, Resource } from 'i18next'
import { I18n } from 'next-i18next'
import { ReactNode, useRef } from 'react'
import { I18nextProvider } from 'react-i18next'
import { RoutingLocale } from '@/utils/l10n/types'
import { initTranslations } from '../i18n'

type Props = {
  children: ReactNode
  locale: RoutingLocale
  resources: Resource
}

export const TranslationsProvider = ({ children, locale, resources }: Props) => {
  const i18nRef = useRef<I18n>()
  if (i18nRef.current == null) {
    i18nRef.current = createInstance()
    initTranslations(locale, i18nRef.current, resources)
  }

  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>
}
