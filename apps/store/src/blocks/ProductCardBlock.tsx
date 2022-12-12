import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { SbBaseBlockProps, LinkField, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type ProductCardBlockProps = SbBaseBlockProps<{
  title: string
  subtitle: string
  image: StoryblokAsset
  link: LinkField
}>

export const ProductCardBlock = ({ blok }: ProductCardBlockProps) => {
  return (
    <StyledLink href={getLinkFieldURL(blok.link)} {...storyblokEditable(blok)}>
      <ProductCard
        title={blok.title}
        subtitle={blok.subtitle}
        image={{ src: blok.image.filename, alt: blok.image.alt }}
      />
    </StyledLink>
  )
}
ProductCardBlock.blockName = 'productCard'

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
})
