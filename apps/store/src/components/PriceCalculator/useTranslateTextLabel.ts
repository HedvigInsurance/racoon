import { useCallback } from 'react'
import { TextLabel as TextLabelProps } from '@/services/formTemplate/FormTemplate.types'

const t = (key: string, _placeholders?: Record<string, string | number>) => key

type TranslateTextLabelParams = {
  data: Record<string, string | number>
}

export const useTranslateTextLabel = ({ data }: TranslateTextLabelParams) => {
  return useCallback(
    (label: TextLabelProps) => {
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
    [data],
  )
}
