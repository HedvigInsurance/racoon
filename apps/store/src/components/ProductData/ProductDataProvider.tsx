'use client'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomFamily, useHydrateAtoms } from 'jotai/utils'
import { type ReactNode } from 'react'
import type { RoutingLocale } from '@/utils/l10n/types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import type { ProductData } from './ProductData.types'

// As an alternative, we could use {locale, productId} as key and provide deepEquals as custom equality function
// Using string key seems simpler
const productKey = (productId: string, locale: RoutingLocale) => `${locale}/${productId}`

const currentProductAtom = atom<string | null>(null)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productDataAtomFamily = atomFamily((_key) => atom<ProductData | null>(null))
const productDataAtom = atom<ProductData | null>((get) => {
  const key = get(currentProductAtom)
  if (key == null) return null
  const productData = get(productDataAtomFamily(key))
  return productData
})

const selectedTypeOfContractAtom = atom<string | undefined>(undefined)
const selectedProductVariantItem = atom((get) => {
  const productData = get(productDataAtom)
  const typeOfContract = get(selectedTypeOfContractAtom)
  return productData?.variants.find((item) => item.typeOfContract === typeOfContract)
})

type Props = {
  children: ReactNode
  productData: ProductData
  selectedTypeOfContract?: string
}

export const ProductDataProvider = (props: Props) => {
  const locale = useRoutingLocale()
  const key = productKey(props.productData.id, locale)
  useHydrateAtoms(
    [
      [currentProductAtom, key],
      [productDataAtomFamily(key), props.productData],
      [selectedTypeOfContractAtom, props.selectedTypeOfContract],
    ],
    // Force update during client side navigation
    {
      dangerouslyForceHydrate: true,
    },
  )

  return props.children
}

export const useProductData = () => {
  const value = useAtomValue(productDataAtom)
  if (value === null) throw new Error('ProductData accessed without hydrating')
  return value
}

export const useSelectedTypeOfContract = () => {
  return useAtom(selectedTypeOfContractAtom)
}

export const useSelectedProductVariant = () => {
  return useAtomValue(selectedProductVariantItem)
}
