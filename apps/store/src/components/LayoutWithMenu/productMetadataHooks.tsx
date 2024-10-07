import { useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { globalStore } from 'globalStore'
import { type GlobalProductMetadata } from './fetchProductMetadata'
import { productsMetadataAtom } from './productMetadataAtom'

export const useProductMetadata = () => {
  const locale = useRoutingLocale()
  return useAtomValue(productsMetadataAtom(locale), { store: globalStore })
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  const locale = useRoutingLocale()
  useHydrateAtoms([[productsMetadataAtom(locale), metadata]], { store: globalStore })
}
