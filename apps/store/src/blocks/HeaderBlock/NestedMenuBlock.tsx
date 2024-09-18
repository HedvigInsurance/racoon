'use client'
import { type HeaderBlockNewProps } from '@/blocks/HeaderBlock/HeaderBlock'
import { MenuItemBlock, type MenuItemBlockProps } from '@/blocks/HeaderBlock/MenuItemBlock'
import { ProductMenuBlock, type ProductMenuBlockProps } from '@/blocks/HeaderBlock/ProductMenuBlock'
import { SubMenuBlock, type SubMenuBlockProps } from '@/blocks/HeaderBlock/SubMenuBlock'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { GeneralMenuBlock, type GeneralMenuBlockProps } from './GeneralMenuBlock'

type NestedMenuBlockProps = {
  blok: HeaderBlockNewProps['blok']['headerMenu'][number]
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
