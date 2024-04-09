import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import type { GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import type { RoutingLocale } from '@/utils/l10n/types'

// We don't actually need _routingLocale for the atom creation. It will be used
// to create a new atom for each locale by default.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const productsMetadataAtom = atomFamily((_routingLocale: RoutingLocale) =>
  atom<GlobalProductMetadata | null>(null),
)
