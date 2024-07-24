'use client'

import { storyblokEditable } from '@storyblok/react'
import type { ProductCardBlockProps } from '@/blocks/ProductCardBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductGridBlockProps = SbBaseBlockProps<{
  title?: string
  items: ExpectedBlockType<ProductCardBlockProps>
}>

export const ProductGridBlock = ({ blok }: ProductGridBlockProps) => {
  return (
    <ProductGrid title={blok.title} {...storyblokEditable(blok)}>
      {blok.items.map((nestedBlock) => (
        <ProductCardBlock key={nestedBlock._uid || nestedBlock.title} blok={nestedBlock} />
      ))}
    </ProductGrid>
  )
}
