import styled from '@emotion/styled'
import { breakpoints } from 'ui/src/lib/media-query'
import { ConditionalWrapper, mq, theme } from 'ui'
import { Video, VideoProps } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getOptimizedImageUrl } from '@/services/storyblok/Storyblok.helpers'

export type VideoBlockProps = SbBaseBlockProps<
  {
    video: StoryblokAsset
    poster?: StoryblokAsset
    fullBleed?: boolean
  } & Pick<
    VideoProps,
    | 'autoPlay'
    | 'aspectRatioLandscape'
    | 'aspectRatioPortrait'
    | 'maxHeightLandscape'
    | 'maxHeightPortrait'
  >
> & { className?: string }

export const VideoBlock = ({ className, blok }: VideoBlockProps) => {
  const posterUrl = blok.poster?.filename
    ? getOptimizedImageUrl(blok.poster.filename, {
        maxWidth: breakpoints.xxl,
      })
    : undefined
  return (
    <ConditionalWrapper
      condition={!blok.fullBleed}
      wrapWith={(children) => <Wrapper className={className}>{children}</Wrapper>}
    >
      <Video
        sources={[{ url: blok.video.filename }]}
        poster={posterUrl}
        autoPlay={blok.autoPlay}
        aspectRatioLandscape={blok.aspectRatioLandscape}
        aspectRatioPortrait={blok.aspectRatioPortrait}
        maxHeightLandscape={blok.maxHeightLandscape}
        maxHeightPortrait={blok.maxHeightPortrait}
        roundedCorners={!blok.fullBleed}
      />
    </ConditionalWrapper>
  )
}
VideoBlock.blockName = 'videoBlock'

const Wrapper = styled.div({
  paddingInline: theme.space.xs,
  [mq.lg]: {
    paddingInline: theme.space.md,
  },
})
