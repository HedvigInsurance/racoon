'use client'
import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { mq } from 'ui/src/theme/media-query'
import { Slideshow } from '@/components/Slideshow/Slideshow'
import type { ExpectedBlockType, SbBaseBlockProps } from '@/services/storyblok/storyblok'
import type { ImageBlockProps } from './ImageBlock'
import type { VideoBlockProps } from './VideoBlock'

const playVideoExclusively = (
  videoList: Array<HTMLVideoElement>,
  videoToBePlayed: HTMLVideoElement,
) => {
  videoList.forEach((videoNode) => {
    if (videoNode === videoToBePlayed) return
    if (videoNode.played.length > 0 && !videoNode.paused) {
      videoNode.pause()
    }
  })
}

type MediaListBlockProps = SbBaseBlockProps<{
  media: ExpectedBlockType<VideoBlockProps | ImageBlockProps>
}>

export const MediaListBlock = ({ blok }: MediaListBlockProps) => {
  return (
    <Slideshow
      ref={(node) => {
        const videos = Array.from(node?.querySelectorAll('video') ?? [])

        videos.forEach((video) => {
          video.addEventListener('play', () => playVideoExclusively(videos, video))
        })
      }}
      alignment="center"
      {...storyblokEditable(blok)}
    >
      {blok.media.map((nestedBlok) => (
        <Wrapper key={nestedBlok._uid}>
          <StoryblokComponent blok={nestedBlok} nested={true} />
        </Wrapper>
      ))}
    </Slideshow>
  )
}

const Wrapper = styled.div({
  paddingInline: 0,
  width: '90vw',
  [mq.sm]: {
    maxWidth: '20.75rem',
  },
  [mq.lg]: {
    paddingInline: 0,
  },
})
