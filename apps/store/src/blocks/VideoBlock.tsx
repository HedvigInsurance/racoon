import styled from '@emotion/styled'
import { ConditionalWrapper, mq, theme } from 'ui'
import { Video, VideoProps } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

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
  return (
    <ConditionalWrapper
      condition={!blok.fullBleed}
      wrapWith={(children) => <Wrapper className={className}>{children}</Wrapper>}
    >
      <Video
        sources={[{ url: blok.video.filename }]}
        poster={blok.poster?.filename}
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
