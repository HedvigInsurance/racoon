import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { type Template, type TemplateV2 } from '@/services/PriceCalculator/PriceCalculator.types'

export const priceTemplateAtom = atom<Template | null>(null)

export const usePriceTemplate = () => {
  const value = useAtomValue(priceTemplateAtom)
  if (value == null) {
    throw new Error('priceTemplateAtom must be set')
  }
  return value
}

export const useSyncPriceTemplate = (template: Template | TemplateV2) => {
  useHydrateAtoms([[priceTemplateAtom, template]])
}
