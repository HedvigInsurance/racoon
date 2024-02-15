'use client'
import { useHydrateAtoms } from 'jotai/utils'
import { ReactNode } from 'react'
import { GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { productsMetadataAtom } from '@/components/LayoutWithMenu/productMetadataAtom'
import { RoutingLocale } from '@/utils/l10n/types'

type Props = {
  productMetadata: GlobalProductMetadata
  locale: RoutingLocale
  children: ReactNode
}
// Provides jotai value for any client components in subtree
// This needs to be separate from `useHydrateProductMetadata`:
// - we cannot use next/router in app dir
// - we cannot use jotai global store between server renders (https://jotai.org/docs/guides/nextjs#provider)
export const ProductMetadataProvider = ({ productMetadata, locale, children }: Props) => {
  useHydrateAtoms([[productsMetadataAtom(locale), productMetadata]])
  return children
}
