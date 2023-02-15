import { storyblokEditable } from '@storyblok/react'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { OPEN_PRICE_CALCULATOR_QUERY_PARAM } from '@/components/ProductPage/PurchaseForm/useOpenPriceCalculatorQuery'
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

  return (
    <ProductCard
      title={blok.title}
      subtitle={blok.subtitle}
      image={{ src: blok.image.filename, alt: blok.image.alt }}
      aspectRatio={blok.aspectRatio ?? '5 / 4'}
      link={link}
      getPriceLink={getPriceLink(link)}
      {...storyblokEditable(blok)}
    />
  )
}
ProductCardBlock.blockName = 'productCard'

const getPriceLink = (productLink: string) => {
  if (productLink.includes('?')) {
    console.warn(
      "Product link has unexpected parameters, skipping price link generation.  Let's support it when we need it",
    )
    return
  }
  return {
    pathname: productLink,
    query: { [OPEN_PRICE_CALCULATOR_QUERY_PARAM]: true },
  } as const
}
