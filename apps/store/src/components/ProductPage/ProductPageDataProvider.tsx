'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { ReactNode } from 'react'
import { type ProductPageData } from '@/components/ProductPage/getProductPageData'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import type { ProductPageProps } from './ProductPage.types'

// TODO: Only use ProductPageDataProviderV2 once new product pages are live

export const productPageDataAtom = atom<ProductPageData | null>(null)

type Props = Pick<ProductPageProps, 'priceTemplate'> & {
  children: ReactNode
  productPageData: ProductPageData
}

export function ProductPageDataProvider({ children, priceTemplate, productPageData }: Props) {
  useSyncPriceTemplate(priceTemplate)
  useSyncProductPageData(productPageData)
  return children
}

export const useSyncProductPageData = (productPageData: ProductPageData) => {
  useHydrateAtoms([[productPageDataAtom, productPageData]])
}

export const useProductPageData = () => {
  const data = useAtomValue(productPageDataAtom)
  if (data === null) throw new Error('ProductPageData must be defined')
  return data
}
