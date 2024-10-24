'use client'
import { storyblokEditable } from '@storyblok/react'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { ProductPillow } from '@/components/ProductPillow/ProductPillow'
import type { LinkField, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { isSameLink } from '@/utils/url'

export type ProductPillowBlockProps = SbBaseBlockProps<{
  name: string
  label?: string
  image?: StoryblokAsset
  link: LinkField
  priority?: boolean
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
      priority={blok.priority}
      url={url}
      {...storyblokEditable(blok)}
    />
  )
}
ProductPillowBlock.blockName = 'productPillow'
