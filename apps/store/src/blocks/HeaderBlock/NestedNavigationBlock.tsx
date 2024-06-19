'use client'
import { type HeaderBlockProps } from '@/blocks/HeaderBlock/HeaderBlock'
import { NavItemBlock, type NavItemBlockProps } from '@/blocks/HeaderBlock/NavItemBlock'
import {
  NestedNavContainerBlock,
  type NestedNavContainerBlockProps,
} from '@/blocks/HeaderBlock/NestedNavContainerBlock'
import {
  ProductNavContainerBlock,
  type ProductNavContainerBlockProps,
} from '@/blocks/HeaderBlock/ProductNavContainerBlock'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'

type NestedNavigationBlockProps = {
  blok: HeaderBlockProps['blok']['navMenuContainer'][number]
}
export const NestedNavigationBlock = ({ blok }: NestedNavigationBlockProps) => {
  const variant = useResponsiveVariant('lg')

  const navContainer = checkBlockType<NestedNavContainerBlockProps['blok']>(
    blok,
    NestedNavContainerBlock.blockName,
  )
  if (navContainer) {
    return <NestedNavContainerBlock key={navContainer._uid} blok={navContainer} />
  }

  const productNavContainer = checkBlockType<ProductNavContainerBlockProps['blok']>(
    blok,
    ProductNavContainerBlock.blockName,
  )
  if (productNavContainer) {
    return (
      <ProductNavContainerBlock
        key={productNavContainer._uid}
        blok={productNavContainer}
        variant={variant === 'mobile' ? 'mobile' : 'desktop'}
      />
    )
  }

  const navBlock = checkBlockType<NavItemBlockProps['blok']>(blok, NavItemBlock.blockName)
  if (navBlock) return <NavItemBlock key={navBlock._uid} blok={navBlock} />

  return null
}
