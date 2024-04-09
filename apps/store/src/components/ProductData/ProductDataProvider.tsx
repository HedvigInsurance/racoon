'use client'
import { atom, useAtom, useAtomValue, useStore } from 'jotai'
import { atomFamily } from 'jotai/utils'
import type { ReactNode } from 'react'
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
  // Writing on every render and relying on jotai skipping recalculations when value === prevValue
  // This is faster that using effects to sync with current page during client-side navigation
  const store = useStore()
  store.set(currentProductAtom, key)
  store.set(productDataAtomFamily(key), props.productData)
  store.set(selectedTypeOfContractAtom, props.selectedTypeOfContract)
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
