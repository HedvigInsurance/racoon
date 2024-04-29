'use client'

import { StoryblokComponent } from '@storyblok/react'
import { AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import type { FontSizes } from 'ui'
import { Ticker, TickerItem, useTickerAnimation } from '@/components/Ticker/Ticker'
import type { ExpectedBlockType } from '@/services/storyblok/storyblok'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import type { HeadingBlockProps } from './HeadingBlock'
import type { TextBlockProps } from './TextBlock'

type Props = SbBaseBlockProps<{
  showCheckIcon?: boolean
  tickerItems?: ExpectedBlockType<HeadingBlockProps | TextBlockProps>
  tickerHeight: FontSizes
  tickerHeightDesktop?: FontSizes
}>

export const TickerBlock = ({ blok }: Props) => {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const [visibleIndex, setVisibleIndex] = useState(0)
  const tickerItems = blok.tickerItems ?? []
  const childrenCount = tickerItems.length
  const currentItem = [tickerItems[visibleIndex]]

  useTickerAnimation(() => {
    setVisibleIndex((prevIndex) => (prevIndex + 1) % childrenCount)
  }, isInView)

  const sizes = {
    _: blok.tickerHeight,
    ...(blok.tickerHeightDesktop && { md: blok.tickerHeightDesktop }),
  }

  return (
    <div ref={ref}>
      <Ticker size={sizes}>
        <AnimatePresence initial={true}>
          {currentItem.map((nestedBlock) => (
            <TickerItem key={nestedBlock._uid} showCheckIcon={blok.showCheckIcon}>
              <StoryblokComponent blok={nestedBlock} nested={true}>
                {nestedBlock}
              </StoryblokComponent>
            </TickerItem>
          ))}
        </AnimatePresence>
      </Ticker>
    </div>
  )
}
