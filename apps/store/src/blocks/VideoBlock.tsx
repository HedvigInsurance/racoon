'use client'

import styled from '@emotion/styled'
import { getImageProps } from 'next/image'
import ReactDOM from 'react-dom'
import { ConditionalWrapper, getMediaQueryBreakpoint, mq, theme } from 'ui'
import type { VideoProps } from '@/components/Video/Video'
import { Video } from '@/components/Video/Video'
import type { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

export type VideoBlockProps = SbBaseBlockProps<
  {
    videoUrlWebm?: string
    videoUrl: string
    poster?: StoryblokAsset
    fullBleed?: boolean
    controls?: boolean
  } & Pick<
    VideoProps,
    | 'autoPlay'
    | 'aspectRatioLandscape'
    | 'aspectRatioPortrait'
    | 'maxHeightLandscape'
    | 'maxHeightPortrait'
    | 'hideSoundControl'
  >
> & { className?: string }

export const VideoBlock = ({ className, blok, nested = false }: VideoBlockProps) => {
  const videoSources = [
    ...(blok.videoUrlWebm ? [{ url: blok.videoUrlWebm }] : []),
    { url: blok.videoUrl },
  ]
  const posterImg = blok.poster?.filename
  const posterUrl = posterImg
    ? getImageProps({
        src: getImgSrc(posterImg),
        width: getMediaQueryBreakpoint('lg'),
        height: getMediaQueryBreakpoint('lg'),
        alt: '',
      }).props.src
    : undefined

  if (blok.autoPlay && posterUrl) {
    ReactDOM.preload(posterUrl, { as: 'image' })
  }

  return (
    <ConditionalWrapper
      condition={!(blok.fullBleed || nested)}
      wrapWith={(children) => <Wrapper className={className}>{children}</Wrapper>}
    >
      <Video
        sources={videoSources}
        poster={posterUrl}
        autoPlay={blok.autoPlay}
        aspectRatioLandscape={blok.aspectRatioLandscape}
        aspectRatioPortrait={blok.aspectRatioPortrait}
        maxHeightLandscape={blok.maxHeightLandscape}
        maxHeightPortrait={blok.maxHeightPortrait}
        roundedCorners={!blok.fullBleed}
        showControls={blok.controls}
        hideSoundControl={blok.hideSoundControl}
      />
    </ConditionalWrapper>
  )
}

const Wrapper = styled.div({
  paddingInline: theme.space.xs,
  [mq.lg]: {
    paddingInline: theme.space.md,
  },
})
