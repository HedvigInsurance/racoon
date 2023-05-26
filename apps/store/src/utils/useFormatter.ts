import { useTranslation } from 'next-i18next'
import { useCallback, useMemo } from 'react'
import { Formatter } from '@/utils/formatter'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'

export const useFormatter = (): Formatter => {
  const { locale } = useCurrentLocale()
  const { t } = useTranslation()
  return useMemo(() => new Formatter({ locale, t }), [locale, t])
}

export type AutoFormatOption = 'ssn' | 'date' | 'money' | 'carRegistrationNumber' | 'zipCode'

const FORMAT_CONFIG: Record<string, AutoFormatOption> = {
  ssn: 'ssn',
  registrationNumber: 'carRegistrationNumber',
  zipCode: 'zipCode',
  birthDate: 'date',
}

export const useAutoFormat = () => {
  const formatter = useFormatter()

  return useCallback(
    (key: string, value: unknown) => {
      const format = FORMAT_CONFIG[key] as AutoFormatOption | undefined

      if (format) {
        switch (format) {
          case 'ssn':
            return typeof value === 'string' ? formatter.ssn(value) : String(value)

          case 'carRegistrationNumber':
            return typeof value === 'string'
              ? formatter.carRegistrationNumber(value)
              : String(value)

          case 'zipCode':
            return typeof value === 'string' ? formatter.zipCode(value) : String(value)

          case 'date':
            return typeof value === 'string' ? formatter.fromNow(new Date(value)) : String(value)

          default:
            return String(value)
        }
      }

      return String(value)
    },
    [formatter],
  )
}
