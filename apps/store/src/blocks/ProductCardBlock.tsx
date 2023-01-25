import { storyblokEditable } from '@storyblok/react'
import { ProductCard } from '@/components/ProductCard/ProductCard'
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
  return (
    <ProductCard
      title={blok.title}
      subtitle={blok.subtitle}
      image={{ src: blok.image.filename, alt: blok.image.alt }}
      aspectRatio={blok.aspectRatio ?? '5 / 4'}
      link={getLinkFieldURL(blok.link, blok.title)}
      {...storyblokEditable(blok)}
    />
  )
}
ProductCardBlock.blockName = 'productCard'
