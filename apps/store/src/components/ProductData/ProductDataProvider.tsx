'use client'
import { atom, useAtomValue } from 'jotai'
import { atomFamily, useHydrateAtoms } from 'jotai/utils'
import { createContext, type ReactNode, useContext } from 'react'
import type { RoutingLocale } from '@/utils/l10n/types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import type { ProductData } from './ProductData.types'

// As an alternative, we could use {locale, productId} as key and provide deepEquals as custom equality function
// Using string key seems simpler
const productKey = (productId: string, locale: RoutingLocale) => `${locale}/${productId}`

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productDataAtomFamily = atomFamily((productKey: string) => atom<ProductData | null>(null))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectedTypeOfContractAtomFamily = atomFamily((productKey: string) =>
  atom<string | null>(null),
)

type Props = {
  children: ReactNode
  productData: ProductData
  selectedTypeOfContract?: string
  productKey?: string
}

const ProductKeyContext = createContext<string | null>(null)

// NOTE:
// - Maybe this setup could be simplified to use plain atoms instead of `atomFamily`
//   If you try to do this, test /debugger/terms/[productName] page - it shows multiple product variants
//   and 2 languages at the same time. This might still work with plain atoms if properly surrounded by JotaiProvider wrappers
// - No cleanup on atomFamilies here - we don't have that many products, so it's easier to retain all data
export const ProductDataProvider = (props: Props) => {
  const locale = useRoutingLocale()
  // Custom key is only used in terms debugger page when we want to have several providers (one per variant)
  // on the same page - different key makes them not clash
  const key = props.productKey ?? productKey(props.productData.id, locale)
  useHydrateAtoms([
    [productDataAtomFamily(key), props.productData],
    [selectedTypeOfContractAtomFamily(key), props.selectedTypeOfContract ?? null],
  ])

  return <ProductKeyContext.Provider value={key}>{props.children}</ProductKeyContext.Provider>
}

const useProductKey = (): string => {
  const value = useContext(ProductKeyContext)
  if (value == null) {
    throw new Error('useProductKey called outside of ProductKeyContext.Provider')
  }
  return value
}

export const useProductData = () => {
  const productKey = useProductKey()
  const value = useAtomValue(productDataAtomFamily(productKey))
  if (value === null) throw new Error('ProductData accessed without hydrating')
  return value
}

export const useSelectedTypeOfContractAtom = () => {
  const productKey = useProductKey()
  return selectedTypeOfContractAtomFamily(productKey)
}

export const useSelectedProductVariant = () => {
  const productData = useProductData()
  const typeOfContract = useAtomValue(useSelectedTypeOfContractAtom())
  if (typeOfContract == null) return null
  return productData.variants.find((item) => item.typeOfContract === typeOfContract)
}
