'use client'
import { type HeaderBlockNewProps } from '@/blocks/HeaderBlockNew/HeaderBlock'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlockNew/MenuItemBlock'
import {
  ProductMenuBlock,
  type ProductMenuBlockProps,
} from '@/blocks/HeaderBlockNew/ProductMenuBlock'
import { SubMenuBlock, type SubMenuBlockProps } from '@/blocks/HeaderBlockNew/SubMenuBlock'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { useResponsiveVariant } from '@/utils/useResponsiveVariant'

type NestedMenuBlockProps = {
  blok: HeaderBlockNewProps['blok']['headerMenu'][number]
}
export const NestedMenuBlock = ({ blok }: NestedMenuBlockProps) => {
  const variant = useResponsiveVariant('lg')

  const subMenu = checkBlockType<SubMenuBlockProps['blok']>(blok, SubMenuBlock.blockName)
  if (subMenu) {
    return <SubMenuBlock key={subMenu._uid} blok={subMenu} />
  }

  const productMenu = checkBlockType<ProductMenuBlockProps['blok']>(
    blok,
    ProductMenuBlock.blockName,
  )
  if (productMenu) {
    return (
      <ProductMenuBlock
        key={productMenu._uid}
        blok={productMenu}
        variant={variant === 'mobile' ? 'mobile' : 'desktop'}
      />
    )
  }

  const menuBlock = checkBlockType<MenuItemBlockProps['blok']>(blok, MenuItemBlock.blockName)
  if (menuBlock) return <MenuItemBlock key={menuBlock._uid} blok={menuBlock} />

  return null
}
