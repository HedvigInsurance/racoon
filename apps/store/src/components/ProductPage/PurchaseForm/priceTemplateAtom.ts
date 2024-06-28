import { atom, useAtomValue } from 'jotai'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'

export const priceTemplateAtom = atom<Template | null>(null)

export const usePriceTemplate = () => {
  const value = useAtomValue(priceTemplateAtom)
  if (value == null) {
    throw new Error('priceTemplateAtom must be set')
  }
  return value
}
