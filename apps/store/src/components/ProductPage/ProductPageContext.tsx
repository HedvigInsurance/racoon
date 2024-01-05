import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { ProductPageProps } from './ProductPage.types'

type ProductPageContextData = Omit<
  ProductPageProps,
  'productData' | 'trustpilotData' | 'productReviewsData'
> & {
  content: {
    product: {
      name: string
      description: string
      tagline?: string
    }
  }
}

const ProductPageContext = createContext<ProductPageContextData | null>(null)

type Props = PropsWithChildren<Omit<ProductPageProps, 'trustpilotData' | 'productReviewsData'>>

export const ProductPageContextProvider = ({ children, ...rest }: Props) => {
  const contextValue = useMemo(
    () => ({
      ...rest,
      content: {
        product: {
          name: rest.story.content.name || rest.productData.displayNameShort,
          description: rest.story.content.description || rest.productData.displayNameFull,
          tagline: rest.story.content.tagline,
        },
      },
    }),
    [rest],
  )

  return <ProductPageContext.Provider value={contextValue}>{children}</ProductPageContext.Provider>
}

export const useProductPageContext = () => {
  const context = useContext(ProductPageContext)

  if (context === null) throw new Error('ProductPageContext accessed outside Provider')

  return context
}
