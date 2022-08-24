import { SbBlokData, StoryblokComponent } from '@storyblok/react'
import * as Timeline from '@/components//Timeline/Timeline'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

type Props = SbBaseBlockProps<{
  items: Array<SbBlokData>
}>

export const TimelineBlock = ({ blok }: Props) => {
  return (
    <Timeline.Root>
      {blok.items.map((nestedBlock, i) => {
        const isFirst = i === 0
        const isLast = i === blok.items.length - 1
        return (
          <StoryblokComponent
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
TimelineBlock.blockName = 'timeline'
