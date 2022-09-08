import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ProductVariant } from '@/services/apollo/generated'
import { ProductPageProps } from './ProductPage.types'

type ProductPageContextData = ProductPageProps & {
  selectedVariant: null | ProductVariant
  selectedVariantUpdate: (variant: ProductVariant) => void
}

const ProductPageContext = createContext<ProductPageContextData | null>(null)

type Props = PropsWithChildren<
  ProductPageProps & {
    initialSelectedVariant?: ProductVariant
  }
>

export const ProductPageContextProvider = (props: Props) => {
  const { children, initialSelectedVariant = null, ...rest } = props
  const [selectedVariant, setSelectedVariant] = useState(initialSelectedVariant)

  const contextValue = useMemo(
    () => ({
      ...rest,
      selectedVariant,
      selectedVariantUpdate: setSelectedVariant,
    }),
    [rest, selectedVariant],
  )

  return <ProductPageContext.Provider value={contextValue}>{children}</ProductPageContext.Provider>
}

export const useProductPageContext = () => {
  const context = useContext(ProductPageContext)

  if (context === null) throw new Error('ProductPageContext accessed outside Provider')

  return context
}
