'use client'
import { type HeaderBlockProps } from '@/blocks/HeaderBlockNew/HeaderBlock'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlockNew/MenuItemBlock'
import {
  ProductMenuBlock,
  type ProductMenuBlockProps,
} from '@/blocks/HeaderBlockNew/ProductMenuBlock'
import { SubMenuBlock, type SubMenuBlockProps } from '@/blocks/HeaderBlockNew/SubMenuBlock'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { GeneralMenuBlock, type GeneralMenuBlockProps } from './GeneralMenuBlock'

type NestedMenuBlockProps = {
  blok: HeaderBlockProps['blok']['headerMenu'][number]
  variant: 'mobile' | 'desktop'
}
export const NestedMenuBlock = ({ blok, variant }: NestedMenuBlockProps) => {
  const generalMenu = checkBlockType<GeneralMenuBlockProps['blok']>(
    blok,
    GeneralMenuBlock.blockName,
  )
  if (generalMenu) {
    return <GeneralMenuBlock key={generalMenu._uid} blok={generalMenu} />
  }

  const subMenu = checkBlockType<SubMenuBlockProps['blok']>(blok, SubMenuBlock.blockName)
  if (subMenu) {
    return <SubMenuBlock key={subMenu._uid} blok={subMenu} variant={variant} />
  }

  const productMenu = checkBlockType<ProductMenuBlockProps['blok']>(
    blok,
    ProductMenuBlock.blockName,
  )
  if (productMenu) {
    return <ProductMenuBlock key={productMenu._uid} blok={productMenu} variant={variant} />
  }

  const menuBlock = checkBlockType<MenuItemBlockProps['blok']>(blok, MenuItemBlock.blockName)
  if (menuBlock) return <MenuItemBlock key={menuBlock._uid} blok={menuBlock} />

  return null
}
