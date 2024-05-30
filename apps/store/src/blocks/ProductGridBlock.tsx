'use client'

import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import type { ProductCardBlockProps } from '@/blocks/ProductCardBlock'
import { ProductCardBlock } from '@/blocks/ProductCardBlock'
import { ProductGrid } from '@/components/ProductGrid/ProductGrid'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductGridBlockProps = SbBaseBlockProps<{
  title?: string
  items: ExpectedBlockType<ProductCardBlockProps>
}>

export const ProductGridBlock = ({ blok }: ProductGridBlockProps) => {
  const items = useMemo(
    () => blok.items.map((item) => ({ key: item._uid || item.title, ...item })),
    [blok.items],
  )
  return (
    <ProductGrid title={blok.title} items={items} {...storyblokEditable(blok)}>
      {(nestedBlock) => <ProductCardBlock key={nestedBlock.key} blok={nestedBlock} />}
    </ProductGrid>
  )
}
