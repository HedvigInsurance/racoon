import styled from '@emotion/styled'
import { mq } from 'ui'
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
>

export const VideoBlock = ({ blok }: VideoBlockProps) => {
  return (
    <Wrapper>
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

const Wrapper = styled.div(({ theme }) => ({
  paddingLeft: theme.space[2],
  paddingRight: theme.space[2],
  [mq.lg]: {
    paddingLeft: theme.space[4],
    paddingRight: theme.space[4],
  },
}))
