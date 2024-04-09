'use client'
import type { ReactNode } from 'react'
import type { GlobalProductMetadata } from '@/components/LayoutWithMenu/fetchProductMetadata'
import { useHydrateProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'

type Props = {
  productMetadata: GlobalProductMetadata
  children: ReactNode
}
export const ProductMetadataProvider = ({ productMetadata, children }: Props) => {
  useHydrateProductMetadata(productMetadata)
  return children
}
