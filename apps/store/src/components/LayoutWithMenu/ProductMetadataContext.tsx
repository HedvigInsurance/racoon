import { createContext, useContext } from 'react'
import { GlobalProductMetadata } from './fetchProductMetadata'

const ProductMetadataContext = createContext<GlobalProductMetadata | null>(null)

export const useProductMetadata = () => {
  const context = useContext(ProductMetadataContext)
  if (context === undefined) {
    throw new Error('useGlobalProductMetadata must be used within a GlobalProductMetadataProvider')
  }
  return context
}

export const ProductMetadataProvider = ProductMetadataContext.Provider
