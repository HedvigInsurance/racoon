import { TextLabel } from '@/shared/types'

export const parseLabel = (text: string): TextLabel => {
  const placeholders = text.match(/{(\w+)}/g)

  return {
    text,
    placeholders: placeholders?.map((placeholder) => ({
      key: placeholder.substring(1, placeholder.length - 1),
      pattern: placeholder,
    })),
  }
}
