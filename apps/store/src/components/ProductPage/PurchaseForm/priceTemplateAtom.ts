import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect } from 'react'
import { type Template } from '@/services/PriceCalculator/PriceCalculator.types'

export const priceTemplateAtom = atom<Template | null>(null)

export const usePriceTemplate = () => {
  const value = useAtomValue(priceTemplateAtom)
  if (value == null) {
    throw new Error('priceTemplateAtom must be set')
  }
  return value
}

export const useSyncPriceTemplate = (template: Template) => {
  useHydrateAtoms([[priceTemplateAtom, template]])
  const setTemplate = useSetAtom(priceTemplateAtom)
  useEffect(() => {
    setTemplate(template)
  }, [setTemplate, template])
}
