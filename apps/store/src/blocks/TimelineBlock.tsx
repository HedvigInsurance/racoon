'use client'
import type { TimelineItemBlockProps } from '@/blocks/TimelineItemBlock'
import { TimelineItemBlock } from '@/blocks/TimelineItemBlock'
import * as Timeline from '@/components//Timeline/Timeline'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { filterByBlockType } from '@/services/storyblok/Storyblok.helpers'

type Props = SbBaseBlockProps<{
  items: ExpectedBlockType<TimelineItemBlockProps>
}>

export const TimelineBlock = ({ blok }: Props) => {
  const timelineItems = filterByBlockType(blok.items, TimelineItemBlock.blockName)
  return (
    <Timeline.Root>
      {timelineItems.map((nestedBlock, i) => {
        const isFirst = i === 0
        const isLast = i === blok.items.length - 1
        return (
          <TimelineItemBlock
            key={nestedBlock._uid}
            blok={nestedBlock}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      })}
    </Timeline.Root>
  )
}
