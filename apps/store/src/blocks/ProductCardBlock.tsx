'use client'
import { storyblokEditable } from '@storyblok/react'
import { useProductMetadata } from '@/components/LayoutWithMenu/productMetadataHooks'
import { type LinkType, ProductCard } from '@/components/ProductCard/ProductCard'
import type { LinkField, SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getImgSrc, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { isSameLink } from '@/utils/url'

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

export const ProductCardBlock = ({ blok }: ProductCardBlockProps) => {
  const link = getLinkFieldURL(blok.link, blok.title)
  const productMetadata = useProductMetadata()
  const linkType = getLinkType(productMetadata, link)

  if (linkType === 'content') {
    console.warn(
      '[ProductCardBlock]: provided "link" does not refer to a product neither a category. Skipping ProductCard render!',
    )
    return null
  }

  return (
    <ProductCard
      title={blok.title}
      subtitle={blok.subtitle}
      image={{ src: getImgSrc(blok.image.filename), alt: blok.image.alt, priority: blok.priority }}
      aspectRatio={blok.aspectRatio ?? '5 / 4'}
      link={{ url: link, type: linkType }}
      {...storyblokEditable(blok)}
    />
  )
}

const getLinkType = (
  productMetadata: ReturnType<typeof useProductMetadata> = [],
  link: string,
): LinkType | 'content' => {
  const isProductLink = productMetadata?.some((product) => isSameLink(link, product.pageLink))
  if (isProductLink) {
    return 'product'
  }

  const isCategoryLink = productMetadata?.some(
    (product) => product.categoryPageLink && isSameLink(link, product.categoryPageLink),
  )
  if (isCategoryLink) {
    return 'category'
  }

  return 'content'
}
