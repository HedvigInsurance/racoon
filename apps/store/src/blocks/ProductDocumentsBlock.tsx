import { storyblokEditable } from '@storyblok/react'
import { ProductDocuments } from '@/components/ProductPage/ProductDocuments'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  heading: string
}>

export const ProductDocumentsBlock = ({ blok }: Props) => {
  const { productData } = useProductPageContext()
  const { heading } = blok
  return (
    <ProductDocuments heading={heading} productData={productData} {...storyblokEditable(blok)} />
  )
}

ProductDocumentsBlock.blockName = 'productDocuments'
