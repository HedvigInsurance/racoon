'use client'
import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { useProductData } from '../ProductData/ProductDataProvider'
import type { ProductPageProps } from './ProductPage.types'

type ProductPageData = {
  product: {
    name: string
    description: string
    tagline?: string
  }
}

const productPageDataAtom = atom<ProductPageData | null>(null)

type Props = PropsWithChildren<Pick<ProductPageProps, 'priceTemplate' | 'story'>>

export function ProductPageDataProvider({ children, story, priceTemplate }: Props) {
  useSyncPriceTemplate(priceTemplate)
  useSyncProductPageData(story)
  return children
}

const useSyncProductPageData = (story: ProductPageProps['story']) => {
  const productData = useProductData()
  const productPageData = useMemo(
    () => ({
      product: {
        name: story.content.name || productData.displayNameShort,
        description: story.content.description || productData.displayNameFull,
        tagline: story.content.tagline,
      },
    }),
    [productData, story.content],
  )
  useHydrateAtoms([[productPageDataAtom, productPageData]], {
    dangerouslyForceHydrate: true,
  })
}

export const useProductPageData = () => {
  const data = useAtomValue(productPageDataAtom)
  if (data === null) throw new Error('ProductPageData must be defined')
  return data
}
