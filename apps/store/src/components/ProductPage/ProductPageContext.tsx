'use client'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useSyncPriceTemplate } from '@/components/ProductPage/PurchaseForm/priceTemplateAtom'
import { useProductData } from '../ProductData/ProductDataProvider'
import type { ProductPageProps } from './ProductPage.types'

type ProductPageContextData = {
  content: {
    product: {
      name: string
      description: string
      tagline?: string
    }
  }
}

const ProductPageContext = createContext<ProductPageContextData | null>(null)

type Props = PropsWithChildren<Pick<ProductPageProps, 'priceTemplate' | 'story'>>

export const ProductPageContextProvider = ({ children, story, priceTemplate }: Props) => {
  useSyncPriceTemplate(priceTemplate)

  const productData = useProductData()
  const contextValue = useMemo(
    () => ({
      content: {
        product: {
          name: story.content.name || productData.displayNameShort,
          description: story.content.description || productData.displayNameFull,
          tagline: story.content.tagline,
        },
      },
    }),
    [productData, story.content],
  )
  return <ProductPageContext.Provider value={contextValue}>{children}</ProductPageContext.Provider>
}

export const useProductPageContext = () => {
  const context = useContext(ProductPageContext)

  if (context === null) throw new Error('ProductPageContext accessed outside Provider')

  return context
}
