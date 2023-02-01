import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import { TopPickCardBlock, TopPickCardBlockProps } from './TopPickCardBlock'

type ProductSlideshowBlockProps = SbBaseBlockProps<{
  title?: string
  items: ExpectedBlockType<TopPickCardBlockProps>
}>

export const ProductSlideshowBlock = ({ blok }: ProductSlideshowBlockProps) => {
  const topPickCardItems = filterByBlockType(blok.items, TopPickCardBlock.blockName)

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Slideshow title={blok.title}>
        {topPickCardItems.map((nestedBlock) => (
          <TopPickCardBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </Slideshow>
    </Wrapper>
  )
}
ProductSlideshowBlock.blockName = 'productSlideshow'

const Wrapper = styled.div({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
})
