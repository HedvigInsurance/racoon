import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq } from 'ui'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { VideoBlock, VideoBlockProps } from './VideoBlock'

type VideoListBlockProps = SbBaseBlockProps<{
  videos: ExpectedBlockType<VideoBlockProps>
}>

export const VideoListBlock = ({ blok }: VideoListBlockProps) => {
  return (
    <Grid numberOfCols={blok.videos.length} {...storyblokEditable(blok)}>
      {/* This is a workaround for centralizing content in containers that may scroll. */}
      {/* Using justify-content: center; on a scroll container will cause an issue where */}
      {/* the first item will be cutted out. Those <span>'s will occupy flexible columns (1fr) */}
      {/* added to the edges, which will centrilize the remaining content. */}
      {/* There is a CSS working draft that solves this issue: justify-content: center safe; */}
      {/* However it's not well support yet. More info --> http://bitly.ws/y7ak */}
      <span aria-hidden="true" />
      {blok.videos.map((nestedVideoBlock) => (
        <ScrollableItem key={nestedVideoBlock._uid}>
          <VideoBlock blok={nestedVideoBlock} />
        </ScrollableItem>
      ))}
      <span aria-hidden="true" />
    </Grid>
  )
}
VideoListBlock.blockName = 'videoList'

const Grid = styled.div<{ numberOfCols: number }>(({ theme, numberOfCols }) => ({
  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateColumns: `1fr repeat(${numberOfCols}, 90vw) 1fr`,
  gap: theme.space[4],
  paddingInline: theme.space[6],
  scrollSnapType: 'x mandatory',
  overflowX: 'auto',
  [mq.md]: {
    gridTemplateColumns: `1fr repeat(${numberOfCols}, minmax(auto, 20.75rem)) 1fr`,
  },
}))

const ScrollableItem = styled.div({
  scrollSnapAlign: 'center',
})
