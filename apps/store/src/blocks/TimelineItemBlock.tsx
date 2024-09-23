'use client'

import styled from '@emotion/styled'
import { type StoryblokRichTextNode } from '@storyblok/richtext'
import { Heading, theme } from 'ui'
import * as Timeline from '@/components/Timeline/Timeline'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { renderRichTextToString } from './RichTextBlock/richTextReactRenderer'

export type TimelineItemBlockProps = SbBaseBlockProps<{
  title: string
  body: StoryblokRichTextNode
}> & {
  isFirst: boolean
  isLast: boolean
}

export const TimelineItemBlock = ({ blok, isFirst, isLast }: TimelineItemBlockProps) => {
  const contentHtml = renderRichTextToString(blok.body)
  return (
    <Timeline.Item>
      <Timeline.Separator>
        {!isFirst && <Timeline.Connector />}
        <Timeline.Icon />
        {!isLast && <Timeline.Connector />}
      </Timeline.Separator>
      <Timeline.Content>
        <Heading as="h3" variant="standard.18">
          {blok.title}
        </Heading>
        <StyledBody dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Timeline.Content>
    </Timeline.Item>
  )
}
TimelineItemBlock.blockName = 'timelineItem'

const StyledBody = styled.div({
  color: theme.colors.gray600,
  marginTop: theme.space.xs,
})
