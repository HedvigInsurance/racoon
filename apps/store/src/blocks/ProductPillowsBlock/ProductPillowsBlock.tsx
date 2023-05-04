import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq, theme } from 'ui'
import { SbBaseBlockProps, ExpectedBlockType } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { ProductPillowBlock, ProductPillowBlockProps } from './ProductPillowBlock'

export type ProductPillowsBlockProps = SbBaseBlockProps<{
  items: ExpectedBlockType<ProductPillowBlockProps>
}>

export const ProductPillowsBlock = ({ blok }: ProductPillowsBlockProps) => {
  const items = filterByBlockType(blok.items, ProductPillowBlock.blockName)
  return (
    <ProductPillowsWrapper {...storyblokEditable(blok)}>
      <ScrollerContent>
        <ScrollerPlatter role="list">
          {items.map((nestedBlock) => (
            <ScrollerItem key={nestedBlock._uid} role="listitem">
              <ProductPillowBlock blok={nestedBlock} />
            </ScrollerItem>
          ))}
        </ScrollerPlatter>
      </ScrollerContent>
    </ProductPillowsWrapper>
  )
}
ProductPillowsBlock.blockName = 'productPillows'

const PILLOW_HEIGHT = '10.75rem'

const ProductPillowsWrapper = styled.div({
  // Hide scrollbar
  overflow: 'hidden',
  height: PILLOW_HEIGHT,
  marginBottom: `-${theme.space.xl}`,
  paddingBottom: theme.space.xl,

  [mq.md]: {
    height: 'auto',
    overflow: 'visible',
    marginBottom: 0,
    paddingBottom: 0,
  },
})

const ScrollerContent = styled.div({
  position: 'relative',
  scrollSnapType: 'x mandatory',
  overscrollBehaviorX: 'contain',
  overflowX: 'auto',
  whiteSpace: 'nowrap',
})

const ScrollerPlatter = styled.div({
  display: 'flex',
  width: '100%',
  paddingTop: theme.space.sm,
  paddingBottom: theme.space.xl,

  [mq.md]: {
    padding: 0,
  },
})

const ScrollerItem = styled.div({
  flexShrink: 0,
  scrollSnapAlign: 'start',

  '&:first-of-type': {
    marginLeft: 'auto',
    paddingLeft: theme.space.md,
  },

  '&:last-of-type': {
    marginRight: 'auto',
    paddingRight: theme.space.md,
  },
})
