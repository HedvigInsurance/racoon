'use client'
import type { ReactNode } from 'react'
import { type ProductPageData } from '@/components/ProductPage/getProductPageData'
import { useSyncProductPageData } from './ProductPageDataProvider'

type Props = {
  children: ReactNode
  productPageData: ProductPageData
}

export function ProductPageDataProviderV2({ children, productPageData }: Props) {
  useSyncProductPageData(productPageData)
  return children
}
