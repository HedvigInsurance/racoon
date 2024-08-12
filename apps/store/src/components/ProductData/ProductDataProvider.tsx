'use client'
import { atom, useAtom, useAtomValue } from 'jotai'
import { type ReactNode } from 'react'
import { JotaiScopeProvider } from '@/components/JotaiScopeProvider'
import type { RoutingLocale } from '@/utils/l10n/types'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import type { ProductData } from './ProductData.types'

// As an alternative, we could use {locale, productId} as key and provide deepEquals as custom equality function
// Using string key seems simpler
const productKey = (productId: string, locale: RoutingLocale) => `${locale}/${productId}`

export const productDataAtom = atom<ProductData | null>(null)

export const selectedTypeOfContractAtom = atom<string | undefined>(undefined)
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

export function ProductDataProvider(props: Props) {
  const locale = useRoutingLocale()
  const atomsWithValues = [
    [productDataAtom, props.productData],
    [selectedTypeOfContractAtom, props.selectedTypeOfContract],
  ] as const
  return (
    <JotaiScopeProvider
      key={productKey(props.productData.name, locale)}
      atomsWithValues={atomsWithValues}
    >
      {props.children}
    </JotaiScopeProvider>
  )
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
