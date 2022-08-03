import styled from '@emotion/styled'
import { SbBlokData, StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type ProductSlideshowBlockProps = SbBaseBlockProps<{
  title?: string
  items: Array<SbBlokData>
}>

export const ProductSlideshowBlock = ({ blok }: ProductSlideshowBlockProps) => {
  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Slideshow>
        {blok.items.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </Slideshow>
    </Wrapper>
  )
}

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[3],
  paddingRight: theme.space[3],
}))
