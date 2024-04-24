'use client'

import { StoryblokComponent } from '@storyblok/react'
import type { FontSizes } from 'ui'
import { theme } from 'ui'
import { Ticker, TickerItem } from '@/components/Ticker/Ticker'
import type { ExpectedBlockType } from '@/services/storyblok/storyblok'
import { type SbBaseBlockProps } from '@/services/storyblok/storyblok'
import type { HeadingBlockProps } from './HeadingBlock'
import type { TextBlockProps } from './TextBlock'

type Props = SbBaseBlockProps<{
  topMargin: boolean
  uspText?: string
  showCheckIcon?: boolean
  tickerItems?: ExpectedBlockType<HeadingBlockProps | TextBlockProps>
  tickerHeight: FontSizes
  tickerHeightDesktop?: FontSizes
}>

export const TickerBlock = ({ blok }: Props) => {
  const tickerItems = blok.tickerItems ?? []
  /* TODO: Deprecated, remove when Storyblok content has migrated to tickerItems */
  const uspList = blok.uspText?.split('\n') ?? []
  const showTickerItems = tickerItems.length > 1

  const sizes = {
    _: blok.tickerHeight,
    ...(blok.tickerHeightDesktop && { md: blok.tickerHeightDesktop }),
  }

  return (
    <>
      {/* TODO: Top margin will be deprecated, remove once migrated */}
      {blok.topMargin && <div style={{ height: theme.space.md }} />}
      <Ticker size={sizes}>
        {showTickerItems
          ? tickerItems.map((nestedBlock) => (
              <TickerItem key={nestedBlock._uid} showCheckIcon={blok.showCheckIcon}>
                <StoryblokComponent blok={nestedBlock} nested={true}>
                  {nestedBlock}
                </StoryblokComponent>
              </TickerItem>
            ))
          : uspList.map((item, index) => (
              <TickerItem key={index} showCheckIcon={true}>
                {item}
              </TickerItem>
            ))}
      </Ticker>
    </>
  )
}
