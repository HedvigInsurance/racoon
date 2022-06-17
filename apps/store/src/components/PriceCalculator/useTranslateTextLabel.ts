import { useCallback } from 'react'
import { TextLabel as TextLabelProps } from './PriceCalculator.types'

const t = (key: string) => key

export const useTranslateTextLabel = () => {
  return useCallback((label: TextLabelProps) => {
    const { text, placeholders } = label

    if (!placeholders) return text

    return placeholders.reduce(
      (acc, placeholder) => acc.replace(placeholder.pattern, t(placeholder.key)),
      text,
    )
  }, [])
}
