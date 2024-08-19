'use client'
import { useTranslation } from 'next-i18next'
import { type ChangeEventHandler } from 'react'
import { InputSelect } from '@/components/InputSelect/InputSelect'
import { getCountryLocale } from '@/utils/l10n/countryUtils'
import { LocaleField } from '@/utils/l10n/locales'
import { getLocaleOrFallback, translateLanguageName } from '@/utils/l10n/localeUtils'
import type { Language } from '@/utils/l10n/types'
import { useChangeLocale } from '@/utils/l10n/useChangeLocale'
import { useCurrentCountry } from '@/utils/l10n/useCurrentCountry'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export function LanguageSelector() {
  const currentCountry = useCurrentCountry()
  const { t } = useTranslation()
  const handleLocaleChange = useChangeLocale()

  const languageList = currentCountry.locales.map((locale) => {
    const { language } = getLocaleOrFallback(locale)
    return {
      name: translateLanguageName(language, t),
      value: language,
    }
  })

  const handleChangeLanguage: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLanguage = event.target.value as Language
    const newLocale = getCountryLocale(currentCountry.id, newLanguage)
    handleLocaleChange(newLocale)
  }
  const { language: currentLanguage } = useCurrentLocale()

  return (
    <InputSelect
      name={LocaleField.Language}
      onChange={handleChangeLanguage}
      defaultValue={currentLanguage}
      options={languageList}
      backgroundColor="gray300"
      size="small"
    />
  )
}
