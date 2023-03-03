import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { GlobalProductMetadata } from './fetchProductMetadata'

const productsAtom = atom<GlobalProductMetadata | null>(null)

export const useProductMetadata = () => {
  return useAtomValue(productsAtom)
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  useHydrateAtoms([[productsAtom, metadata] as const])
}
