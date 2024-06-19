import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { NestedNavigationBlock } from '@/blocks/HeaderBlock/NestedNavigationBlock'
import { Header } from '@/components/Header/Header'
import { ShoppingCartMenuItem } from '@/components/Header/ShoppingCartMenuItem'
import { TopMenu } from '@/components/Header/TopMenu/TopMenu'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { checkBlockType } from '@/services/storyblok/Storyblok.helpers'
import { type NavItemBlockProps } from './NavItemBlock'
import { type NestedNavContainerBlockProps } from './NestedNavContainerBlock'
import {
  ProductNavContainerBlock,
  type ProductNavContainerBlockProps,
} from './ProductNavContainerBlock'

export type HeaderBlockProps = SbBaseBlockProps<{
  navMenuContainer: ExpectedBlockType<
    NestedNavContainerBlockProps | NavItemBlockProps | ProductNavContainerBlockProps
  >
}>

// Performance considerations
// - this block is important for site-wide INP since it's present on most pages and is used often
export const HeaderBlock = ({ blok }: HeaderBlockProps) => {
  const productNavItem = useMemo(
    () =>
      blok.navMenuContainer.find((item) =>
        checkBlockType<ProductNavContainerBlockProps['blok']>(
          item,
          ProductNavContainerBlock.blockName,
        ),
      )?.name,
    [blok.navMenuContainer],
  )
  return (
    <Header {...storyblokEditable(blok)}>
      <TopMenu defaultValue={productNavItem}>
        {blok.navMenuContainer.map((item) => (
          <NestedNavigationBlock key={item._uid} blok={item} />
        ))}
      </TopMenu>

      <ShoppingCartMenuItem />
    </Header>
  )
}
HeaderBlock.blockName = 'header'
