import { useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { layoutJotaiStore } from '@/app/LayoutJotaiProvider'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { type GlobalProductMetadata } from './fetchProductMetadata'
import { productsMetadataAtom } from './productMetadataAtom'

export const useProductMetadata = () => {
  const locale = useRoutingLocale()
  return useAtomValue(productsMetadataAtom(locale), { store: layoutJotaiStore })
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  const locale = useRoutingLocale()
  useHydrateAtoms([[productsMetadataAtom(locale), metadata]], { store: layoutJotaiStore })
}
