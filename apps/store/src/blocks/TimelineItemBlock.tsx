import styled from '@emotion/styled'
import { getStoryblokApi, Richtext } from '@storyblok/react'
import { Heading } from 'ui'
import * as Timeline from '@/components/Timeline/Timeline'
import { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type Props = SbBaseBlockProps<{
  title: string
  body: Richtext
}> & {
  isFirst: boolean
  isLast: boolean
}

export const TimelineItemBlock = ({ blok, isFirst, isLast }: Props) => {
  const contentHtml = getStoryblokApi().richTextResolver.render(blok.body)
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

const StyledBody = styled.div(({ theme }) => ({
  color: theme.colors.gray600,
  marginTop: theme.space[2],
}))
