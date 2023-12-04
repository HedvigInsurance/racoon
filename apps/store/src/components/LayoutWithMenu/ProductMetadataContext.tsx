import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { globalStore } from '@/utils/globalStore'
import { GlobalProductMetadata } from './fetchProductMetadata'

const productsAtom = atom<GlobalProductMetadata | null>(null)

export const useProductMetadata = () => {
  return useAtomValue(productsAtom, { store: globalStore })
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  useHydrateAtoms([[productsAtom, metadata]], { store: globalStore })
}
