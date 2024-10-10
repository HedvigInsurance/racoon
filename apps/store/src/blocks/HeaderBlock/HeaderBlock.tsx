import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { Header } from '@/components/Header/Header'
import { HeaderMenu } from '@/components/Header/HeaderMenu/HeaderMenu'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { type GeneralMenuBlockProps } from './GeneralMenuBlock'
import { type MenuItemBlockProps } from './MenuItemBlock'
import { ProductMenuBlock, type ProductMenuBlockProps } from './ProductMenuBlock'
import { type SubMenuBlockProps } from './SubMenuBlock'

export type HeaderMenuProps = ExpectedBlockType<
  SubMenuBlockProps | MenuItemBlockProps | ProductMenuBlockProps | GeneralMenuBlockProps
>

export type HeaderBlockProps = SbBaseBlockProps<{
  headerMenu: HeaderMenuProps | []
}>

// Performance considerations
// - this block is important for site-wide INP since it's present on most pages and is used often
export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
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
    </Header>
  )
}
HeaderBlock.blockName = 'header'
