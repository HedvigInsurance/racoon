import styled from '@emotion/styled'
import { forwardRef } from 'react'
import { mq, theme } from 'ui'
import { Video, VideoProps } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

type SbRelatedProps = {
  video: StoryblokAsset
  poster?: StoryblokAsset
} & Pick<
  VideoProps,
  | 'autoPlay'
  | 'aspectRatioLandscape'
  | 'aspectRatioPortrait'
  | 'maxHeightLandscape'
  | 'maxHeightPortrait'
>

export type VideoBlockProps = SbBaseBlockProps<SbRelatedProps> &
  // Below are the Video props that will not be controled by the data we get from Storyblok.
  // We can use them to change some aspects of the Video component that are abstracted from
  // editors - In other workds, implementation details.
  Omit<
    VideoProps,
    | 'sources'
    | 'poster'
    | 'autoPlay'
    | 'aspectRatioLandscape'
    | 'aspectRatioPortrait'
    | 'maxHeightLandscape'
    | 'maxHeightPortrait'
  >

export const VideoBlock = forwardRef<HTMLVideoElement, VideoBlockProps>(
  ({ className, blok, ...delegated }, ref) => {
    return (
      <Wrapper className={className}>
        <Video
          ref={ref}
          sources={[{ url: blok.video.filename }]}
          poster={blok.poster?.filename}
          autoPlay={blok.autoPlay}
          aspectRatioLandscape={blok.aspectRatioLandscape}
          aspectRatioPortrait={blok.aspectRatioPortrait}
          maxHeightLandscape={blok.maxHeightLandscape}
          maxHeightPortrait={blok.maxHeightPortrait}
          {...delegated}
        />
      </Wrapper>
    )
  },
)
VideoBlock.displayName = 'VideoBlock'
VideoBlock.blockName = 'videoBlock'

const Wrapper = styled.div({
  paddingInline: theme.space.xs,
  [mq.lg]: {
    paddingInline: theme.space.md,
  },
})
