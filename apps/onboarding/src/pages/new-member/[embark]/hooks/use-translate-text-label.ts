import type { TextLabel as TextLabelProps } from 'embark-core'
import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'

export const useTranslateTextLabel = () => {
  const { t } = useTranslation('embark')

  return useCallback(
    (label?: TextLabelProps) => {
      if (label) {
        const { text, placeholders } = label
        return placeholders?.reduce(
          (acc, placeholder) => acc.replace(placeholder.pattern, t(placeholder.key)),
          text,
        )
      }
    },
    [t],
  )
}
