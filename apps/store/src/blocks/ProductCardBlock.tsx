import { storyblokEditable } from '@storyblok/react'
import { useProductMetadata } from '@/components/LayoutWithMenu/ProductMetadataContext'
import { ProductCard, type LinkType } from '@/components/ProductCard/ProductCard'
import { SbBaseBlockProps, LinkField, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ImageSize = {
  aspectRatio?: '1 / 1' | '3 / 2' | '4 / 3' | '5 / 4' | '2 / 3' | '3 / 4' | '4 / 5'
}

export type ProductCardBlockProps = SbBaseBlockProps<
  {
    title: string
    subtitle: string
    image: StoryblokAsset
    link: LinkField
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
      image={{ src: blok.image.filename, alt: blok.image.alt }}
      aspectRatio={blok.aspectRatio ?? '5 / 4'}
      link={{ url: link, type: linkType }}
      {...storyblokEditable(blok)}
    />
  )
}
ProductCardBlock.blockName = 'productCard'

// Make sure /se-en/products/home == se-en/products/home
const isSameLink = (a: string, b: string) => {
  const normalize = (url: string) => url.replace(/^\//, '')
  return normalize(a) === normalize(b)
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
