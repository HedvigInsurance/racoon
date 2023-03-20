import { storyblokEditable } from '@storyblok/react'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { ProductPillow } from '@/components/ProductPillow/ProductPillow'
import { SbBaseBlockProps, StoryblokAsset, LinkField } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ProductPillowBlockProps = SbBaseBlockProps<{
  name: string
  label?: string
  image?: StoryblokAsset
  link: LinkField
}>

export const ProductPillowBlock = ({ blok }: ProductPillowBlockProps) => {
  const url = getLinkFieldURL(blok.link, blok.name)
  const productMetadata = useProductMetadata()
  const product = productMetadata?.find((product) => isSameLink(url, product.pageLink))
  const pillowImage = product?.pillowImage.src ?? blok.image?.filename
  return (
    <ProductPillow
      name={blok.name}
      label={blok.label}
      image={pillowImage}
      url={url}
      {...storyblokEditable(blok)}
    />
  )
}
ProductPillowBlock.blockName = 'productPillow'

// Make sure /en-se/products/home == en-se/products/home
const isSameLink = (a: string, b: string) => {
  const normalize = (url: string) => url.replace(/^\//, '')
  return normalize(a) === normalize(b)
}
