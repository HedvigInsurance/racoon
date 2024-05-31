'use client'

import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { theme } from 'ui'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'
import type { TopPickCardBlockProps } from './TopPickCardBlock'
import { TopPickCardBlock } from './TopPickCardBlock'

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

const Wrapper = styled.div({
  paddingLeft: theme.space.sm,
  paddingRight: theme.space.sm,
})
