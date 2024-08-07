'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { ReactNode } from 'react'
import { type ProductPageData } from '@/components/ProductPage/getProductPageData'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import type { ProductPageProps } from './ProductPage.types'

const productPageDataAtom = atom<ProductPageData | null>(null)

type Props = Pick<ProductPageProps, 'priceTemplate'> & {
  children: ReactNode
  productPageData: ProductPageData
}

export function ProductPageDataProvider({ children, priceTemplate, productPageData }: Props) {
  useSyncPriceTemplate(priceTemplate)
  useSyncProductPageData(productPageData)
  return children
}

const useSyncProductPageData = (productPageData: ProductPageData) => {
  useHydrateAtoms([[productPageDataAtom, productPageData]], {
    dangerouslyForceHydrate: true,
  })
}

export const useProductPageData = () => {
  const data = useAtomValue(productPageDataAtom)
  if (data === null) throw new Error('ProductPageData must be defined')
  return data
}
