'use client'

import { storyblokEditable } from '@storyblok/react'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { ProductGridItem } from '@/components/ProductGridItem/ProductGridItem'
import type { LinkField, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getImgSrc, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { getLinkType } from './ProductGridItemBlock.helpers'

export type ImageSize = {
  aspectRatio?: '1 / 1' | '3 / 2' | '4 / 3' | '5 / 4' | '2 / 3' | '3 / 4' | '4 / 5'
}

export type ProductCardBlockProps = SbBaseBlockProps<
  {
    title: string
    subtitle: string
    image: StoryblokAsset
    link: LinkField
    priority?: boolean
  } & ImageSize
>

export const ProductGridItemBlock = ({ blok }: ProductCardBlockProps) => {
  const link = getLinkFieldURL(blok.link, blok.title)
  const productMetadata = useProductMetadata()
  const linkType = getLinkType(productMetadata, link)

  if (linkType === 'content') {
    console.warn(
      '[ProductGridItemBlock]: provided "link" does not refer to a product neither a category. Skipping ProductGridItem render!',
    )

    return null
  }

  return (
    <ProductGridItem
      title={blok.title}
      subtitle={blok.subtitle}
      image={{ src: getImgSrc(blok.image.filename), alt: blok.image.alt, priority: blok.priority }}
      aspectRatio={blok.aspectRatio ?? '5 / 4'}
      link={{ url: link, type: linkType }}
      {...storyblokEditable(blok)}
    />
  )
}
