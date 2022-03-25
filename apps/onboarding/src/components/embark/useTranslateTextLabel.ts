import type { TextLabel as TextLabelProps } from 'embark-core'
import { useTranslation } from 'next-i18next'
import { useCallback } from 'react'

export const useTranslateTextLabel = () => {
  const { t } = useTranslation('embark')

  return useCallback(
    (label?: TextLabelProps) => {
      if (label) {
        const { text, placeholders } = label
        if (placeholders)
          return placeholders.reduce(
            (acc, placeholder) => acc.replace(placeholder.pattern, t(placeholder.key)),
            text,
          )
        return text
      }
    },
    [t],
  )
}
