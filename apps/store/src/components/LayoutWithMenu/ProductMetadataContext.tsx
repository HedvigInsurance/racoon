import { atom, useAtomValue } from 'jotai'
import { atomFamily, useHydrateAtoms } from 'jotai/utils'
import { globalStore } from '@/utils/globalStore'
import { type RoutingLocale } from '@/utils/l10n/types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { type GlobalProductMetadata } from './fetchProductMetadata'

// We don't actually neeed _routineLocale for the atom creation. It will be used
// to create a new atom for each locale by default.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productsMetadataAtom = atomFamily((_routingLocale: RoutingLocale) =>
  atom<GlobalProductMetadata | null>(null),
)

export const useProductMetadata = () => {
  const locale = useRoutingLocale()

  return useAtomValue(productsMetadataAtom(locale), { store: globalStore })
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  const locale = useRoutingLocale()

  useHydrateAtoms([[productsMetadataAtom(locale), metadata]], { store: globalStore })
}
