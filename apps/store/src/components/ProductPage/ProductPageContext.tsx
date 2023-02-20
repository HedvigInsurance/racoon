import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'
import { ProductPageProps, ProductDataVariant } from './ProductPage.types'

type ProductPageContextData = ProductPageProps & {
  selectedVariant: ProductDataVariant
  selectedVariantUpdate: (variant: ProductDataVariant) => void
  content: {
    product: {
      name: string
      description: string
      tagline?: string
    }
  }
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
  ...rest
}: Props) => {
  const [selectedVariant, setSelectVariant] = useState(initialSelectedVariant)

  const contextValue = useMemo(
    () => ({
      ...rest,
      selectedVariant,
      selectedVariantUpdate: setSelectVariant,
      content: {
        product: {
          name: rest.story.content.name || rest.productData.displayNameShort,
          description: rest.story.content.description || rest.productData.displayNameFull,
          tagline: rest.story.content.tagline,
        },
      },
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
