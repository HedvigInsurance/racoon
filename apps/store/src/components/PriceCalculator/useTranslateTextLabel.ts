import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '@/services/PriceCalculator/PriceCalculator.types'

type TranslateTextLabelParams = {
  data: Record<string, string | number>
}

export const useTranslateTextLabel = ({ data }: TranslateTextLabelParams) => {
  const { t } = useTranslation('purchase-form')

  return useCallback(
    (label: Label) => {
      const { key, placeholders } = label

      return t(
        key,
        placeholders?.reduce((acc, placeholder) => {
          const value = data[placeholder.key]

          if (value === undefined) return acc

          return {
            ...acc,
            [placeholder.pattern]: value,
          }
        }, {}),
      )
    },
    [t, data],
  )
}
