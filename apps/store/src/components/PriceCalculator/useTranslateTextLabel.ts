import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'
import { Label } from '@/services/PriceCalculator/PriceCalculator.types'

type TranslateTextLabelParams = {
  data: Record<string, string | number>
}

// @TODO: remove this function
export const useTranslateTextLabel = ({ data }: TranslateTextLabelParams) => {
  const { t } = useTranslation('purchase-form')

  return useCallback(
    (label: Label) => {
      const { key, placeholders } = label

      const options = placeholders?.reduce((acc, placeholder) => {
        const value = data[placeholder.key]

        if (value === undefined) return acc

        return {
          ...acc,
          [placeholder.pattern]: value,
        }
      }, {})

      return t(key, { ...options, defaultValue: 'MISSING' })
    },
    [t, data],
  )
}
