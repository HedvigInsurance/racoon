import styled from '@emotion/styled'
import { mq, theme } from 'ui'
import { Video, VideoProps } from '@/components/Video/Video'
import { SbBaseBlockProps, StoryblokAsset } from '@/services/storyblok/storyblok'

export type VideoBlockProps = SbBaseBlockProps<
  {
    video: StoryblokAsset
    poster?: StoryblokAsset
  } & Pick<
    VideoProps,
    | 'autoPlay'
    | 'controls'
    | 'aspectRatioLandscape'
    | 'aspectRatioPortrait'
    | 'maxHeightLandscape'
    | 'maxHeightPortrait'
  >
> & { className?: string }

export const VideoBlock = ({ className, blok }: VideoBlockProps) => {
  return (
    <Wrapper className={className}>
      <Video
        sources={[{ url: blok.video.filename }]}
        poster={blok.poster?.filename}
        autoPlay={blok.autoPlay}
        controls={blok.controls}
        aspectRatioLandscape={blok.aspectRatioLandscape}
        aspectRatioPortrait={blok.aspectRatioPortrait}
        maxHeightLandscape={blok.maxHeightLandscape}
        maxHeightPortrait={blok.maxHeightPortrait}
      />
    </Wrapper>
  )
}
VideoBlock.blockName = 'videoBlock'

const Wrapper = styled.div({
  paddingInline: theme.space[2],
  [mq.lg]: {
    paddingInline: theme.space[4],
  },
})
