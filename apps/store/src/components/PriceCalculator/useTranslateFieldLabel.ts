import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { Label } from '@/services/PriceCalculator/PriceCalculator.types'

export const useTranslateFieldLabel = () => {
  const { t } = useTranslation('purchase-form')

  return useCallback(
    (label: Label, options: Record<string, string | number> = {}) => {
      const { key } = label
      // @ts-expect-error translation key already checked in "form template"
      return t(key, { defaultValue: `MISSING ${key}`, ...options })
    },
    [t],
  )
}
