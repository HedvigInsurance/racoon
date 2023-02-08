import { storyblokEditable } from '@storyblok/react'
import { ProductDocuments } from '@/components/ProductPage/ProductDocuments'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  heading: string
  description: string
}>

export const ProductDocumentsBlock = ({ blok }: Props) => {
  const { productData, selectedVariant } = useProductPageContext()
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

ProductDocumentsBlock.blockName = 'productDocuments'
