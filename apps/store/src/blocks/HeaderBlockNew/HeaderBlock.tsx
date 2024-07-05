import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Header } from '@/components/HeaderNew/Header'
import { HeaderMenu } from '@/components/HeaderNew/HeaderMenu/HeaderMenu'
import { ShoppingCartMenuItem } from '@/components/HeaderNew/ShoppingCartMenuItem/ShoppingCartMenuItem'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { type MenuItemBlockProps } from './MenuItemBlock'
import { ProductMenuBlock, type ProductMenuBlockProps } from './ProductMenuBlock'
import { type SubMenuBlockProps } from './SubMenuBlock'

export type HeaderMenuProps = ExpectedBlockType<
  SubMenuBlockProps | MenuItemBlockProps | ProductMenuBlockProps
>

export type HeaderBlockNewProps = SbBaseBlockProps<{
  headerMenu: HeaderMenuProps | []
}>

// Performance considerations
// - this block is important for site-wide INP since it's present on most pages and is used often
export const HeaderBlock = ({ blok }: HeaderBlockNewProps) => {
  const productNavItem = useMemo(
    () =>
      blok.headerMenu.find((item) =>
        checkBlockType<ProductMenuBlockProps['blok']>(item, ProductMenuBlock.blockName),
      )?.name,
    [blok.headerMenu],
  )
  return (
    <Header {...storyblokEditable(blok)}>
      {blok.headerMenu.length > 0 && (
        <HeaderMenu defaultValue={productNavItem} items={blok.headerMenu} />
      )}

      <ShoppingCartMenuItem />
    </Header>
  )
}
HeaderBlock.blockName = 'header'
