import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { ProductPageProps } from './ProductPage.types'

type ProductPageContextData = Pick<ProductPageProps, 'priceTemplate'> & {
  content: {
    product: {
      name: string
      description: string
      tagline?: string
    }
  }
}

const ProductPageContext = createContext<ProductPageContextData | null>(null)

type Props = PropsWithChildren<Pick<ProductPageProps, 'priceTemplate' | 'story' | 'productData'>>

export const ProductPageContextProvider = ({
  children,
  story,
  productData,
  priceTemplate,
}: Props) => {
  const contextValue = useMemo(
    () => ({
      priceTemplate,
      content: {
        product: {
          name: story.content.name || productData.displayNameShort,
          description: story.content.description || productData.displayNameFull,
          tagline: story.content.tagline,
        },
      },
    }),
    [priceTemplate, productData, story.content],
  )
  return <ProductPageContext.Provider value={contextValue}>{children}</ProductPageContext.Provider>
}

export const useProductPageContext = () => {
  const context = useContext(ProductPageContext)

  if (context === null) throw new Error('ProductPageContext accessed outside Provider')

  return context
}
