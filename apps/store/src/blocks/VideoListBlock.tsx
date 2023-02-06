import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import { useCallback, useRef } from 'react'
import { mq } from 'ui'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import { VideoBlock, VideoBlockProps } from './VideoBlock'

type VideoListBlockProps = SbBaseBlockProps<{
  videos: ExpectedBlockType<VideoBlockProps>
}>

export const VideoListBlock = ({ blok }: VideoListBlockProps) => {
  const videos = useRef<Array<HTMLVideoElement>>([])

  const handlePlay = useCallback<React.ReactEventHandler<HTMLVideoElement>>((event) => {
    videos.current.forEach((video) => {
      const shouldVideoBePaused =
        video !== event.currentTarget && video.played.length > 0 && !video.paused

      if (shouldVideoBePaused) {
        video.pause()
      }
    })
  }, [])

  return (
    <Slideshow alignment="center" {...storyblokEditable(blok)}>
      {blok.videos.map((nestedVideoBlock) => (
        <StyledVideoBlock
          ref={(node) => node && videos.current.push(node)}
          key={nestedVideoBlock._uid}
          blok={nestedVideoBlock}
          onPlay={handlePlay}
        />
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
