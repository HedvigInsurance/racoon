import { atom, useAtomValue } from 'jotai'
import { atomFamily, useHydrateAtoms } from 'jotai/utils'
import { globalStore } from '@/utils/globalStore'
import { type RoutingLocale } from '@/utils/l10n/types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { type GlobalProductMetadata } from './fetchProductMetadata'

// We don't actually neeed _routineLocale for the atom creation. It will be used
// to create a new atom for each locale by default.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productsMetadataAtom = atomFamily((_routingLocale: RoutingLocale) =>
  atom<GlobalProductMetadata | null>(null),
)

export const useProductMetadata = () => {
  const { routingLocale } = useCurrentLocale()

  return useAtomValue(productsMetadataAtom(routingLocale), { store: globalStore })
}

export const useHydrateProductMetadata = (metadata: GlobalProductMetadata) => {
  const { routingLocale } = useCurrentLocale()

  useHydrateAtoms([[productsMetadataAtom(routingLocale), metadata]], { store: globalStore })
}
