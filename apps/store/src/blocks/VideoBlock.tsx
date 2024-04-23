'use client'

import { getImageProps } from 'next/image'
import ReactDOM from 'react-dom'
import { ConditionalWrapper, getMediaQueryBreakpoint } from 'ui'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import type { VideoProps } from '@/components/Video/Video'
import { Video } from '@/components/Video/Video'
import type {
  GridColumnsField,
  SbBaseBlockProps,
  StoryblokAsset,
} from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

export type VideoBlockProps = SbBaseBlockProps<
  {
    videoUrlWebm?: string
    videoUrl: string
    poster?: StoryblokAsset
    fullBleed?: boolean
    controls?: boolean
    layout?: GridColumnsField
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
      wrapWith={(children) => (
        <GridLayout.Root className={className}>
          <GridLayout.Content
            width={blok.layout?.widths ?? { base: '1' }}
            align={blok.layout?.alignment ?? 'center'}
          >
            {children}
          </GridLayout.Content>
        </GridLayout.Root>
      )}
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
