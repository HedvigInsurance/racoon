import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard/ProductCard'
import { SbBaseBlockProps, LinkField, StoryblokImage } from '@/services/storyblok/storyblok'

export type ProductCardBlockProps = SbBaseBlockProps<{
  title: string
  subtitle: string
  image: StoryblokImage
  link: LinkField
}>

export const ProductCardBlock = ({ blok }: ProductCardBlockProps) => {
  return (
    <Link href={blok.link.url} passHref {...storyblokEditable(blok)}>
      <StyledAnchor>
        <ProductCard
          title={blok.title}
          subtitle={blok.subtitle}
          image={{ src: blok.image.filename, alt: blok.image.alt }}
        />
      </StyledAnchor>
    </Link>
  )
}

const StyledAnchor = styled.a({
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
})
