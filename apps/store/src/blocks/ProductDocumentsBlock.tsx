'use client'

import { storyblokEditable } from '@storyblok/react'
import {
  useProductData,
  useSelectedProductVariant,
} from '@/components/ProductData/ProductDataProvider'
import { ProductDocuments } from '@/components/ProductPage/ProductDocuments'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  heading: string
  description: string
}>

export const ProductDocumentsBlock = ({ blok }: Props) => {
  const selectedVariant = useSelectedProductVariant()
  const productData = useProductData()
  const { heading, description } = blok

  const docs = selectedVariant?.documents ?? productData.variants[0].documents
  if (docs.length < 1) {
    console.warn('No documents to show; hiding productDocuments')
    return null
  }

  return (
    <ProductDocuments
      heading={heading}
      description={description}
      docs={docs}
      {...storyblokEditable(blok)}
    />
  )
}
