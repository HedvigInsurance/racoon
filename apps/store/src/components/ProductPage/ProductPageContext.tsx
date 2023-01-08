import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ProductDataQuery } from '@/services/apollo/generated'
import { ProductPageProps } from './ProductPage.types'

type ProductDataVariant =
  | Exclude<ProductDataQuery['product'], undefined | null>['variants'][number]
  | null

type ProductPageContextData = ProductPageProps & {
  selectedVariant: ProductDataVariant
  selectedVariantUpdate: (variant: ProductDataVariant) => void
}

const ProductPageContext = createContext<ProductPageContextData | null>(null)

type Props = PropsWithChildren<
  ProductPageProps & {
    initialSelectedVariant?: ProductDataVariant
  }
>

export const ProductPageContextProvider = ({
  children,
  initialSelectedVariant = null,
  productData,
  ...rest
}: Props) => {
  const [selectedVariant, setSelectVariant] = useState(initialSelectedVariant)

  const contextValue = useMemo(
    () => ({
      ...rest,
      selectedVariant,
      selectedVariantUpdate: setSelectVariant,
      productData: {
        ...productData,
        displayNameShort: rest.story.content.name || productData.displayNameShort,
        displayNameFull: rest.story.content.description || productData.displayNameFull,
      },
    }),
    [rest, productData, selectedVariant],
  )

  return <ProductPageContext.Provider value={contextValue}>{children}</ProductPageContext.Provider>
}

export const useProductPageContext = () => {
  const context = useContext(ProductPageContext)

  if (context === null) throw new Error('ProductPageContext accessed outside Provider')

  return context
}
