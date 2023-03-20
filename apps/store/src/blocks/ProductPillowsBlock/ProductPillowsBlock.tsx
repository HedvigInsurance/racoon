import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useMemo } from 'react'
import { mq, theme } from 'ui'
import { SbBaseBlockProps, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { isDisabledPetLink } from '@/utils/isDisabledPetLink'
import { ProductPillowBlock, ProductPillowBlockProps } from './ProductPillowBlock'

export type ProductPillowsBlockProps = SbBaseBlockProps<{
  items: ExpectedBlockType<ProductPillowBlockProps>
}>

export const ProductPillowsBlock = ({ blok }: ProductPillowsBlockProps) => {
  const filteredProductPillowItems = filterByBlockType(blok.items, ProductPillowBlock.blockName)
  const items = useMemo(
    () =>
      filteredProductPillowItems.filter(
        (item) => !isDisabledPetLink(item.link.story?.full_slug ?? ''),
      ),
    [filteredProductPillowItems],
  )
  return (
    <ProductPillowsWrapper {...storyblokEditable(blok)}>
      {items.map((nestedBlock) => (
        <ProductPillowBlock key={nestedBlock._uid} blok={nestedBlock} />
      ))}
    </ProductPillowsWrapper>
  )
}
ProductPillowsBlock.blockName = 'productPillows'

const ProductPillowsWrapper = styled.nav({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, max-content)',
  columnGap: theme.space.md,
  justifyContent: 'center',

  [mq.md]: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: 0,
  },
})
