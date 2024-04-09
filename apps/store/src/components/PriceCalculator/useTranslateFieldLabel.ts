import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import type { Label } from '@/services/PriceCalculator/PriceCalculator.types'

export const useTranslateFieldLabel = () => {
  const { t } = useTranslation('purchase-form')

  return useCallback(
    (label: Label, options: Record<string, string | number> = {}): string => {
      const { key } = label
      return t(key, { defaultValue: `MISSING ${key}`, ...options })
    },
    [t],
  )
}
