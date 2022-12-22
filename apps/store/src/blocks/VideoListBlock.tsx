import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { mq } from 'ui'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { VideoBlock, VideoBlockProps } from './VideoBlock'

type VideoListBlockProps = SbBaseBlockProps<{
  videos: ExpectedBlockType<VideoBlockProps>
}>

export const VideoListBlock = ({ blok }: VideoListBlockProps) => {
  return (
    <Slideshow alignment="center" {...storyblokEditable(blok)}>
      {blok.videos.map((nestedVideoBlock) => (
        <StyledVideoBlock key={nestedVideoBlock._uid} blok={nestedVideoBlock} />
      ))}
    </Slideshow>
  )
}
VideoListBlock.blockName = 'videoList'

const StyledVideoBlock = styled(VideoBlock)({
  paddingInline: 0,
  width: '90vw',
  [mq.sm]: {
    maxWidth: '20.75rem',
  },
  [mq.lg]: {
    paddingInline: 0,
  },
})
