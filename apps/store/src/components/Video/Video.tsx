import styled from '@emotion/styled'
import { theme } from 'ui'

export type VideoSource = {
  url: string
}

export type VideoSize = {
  aspectRatioLandscape?: '1 / 1' | '16 / 9'
  aspectRatioPortrait?: '4 / 5' | '4 / 6'
  maxHeightLandscape?: number
  maxHeightPortrait?: number
}

export type VideoProps = {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  poster?: string
  autoplay?: boolean
} & VideoSize

const VideoWrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.space[2],
  paddingRight: theme.space[2],
}))

const StyledVideo = styled.video(
  ({
    poster,
    aspectRatioLandscape,
    aspectRatioPortrait,
    maxHeightLandscape,
    maxHeightPortrait,
  }: Omit<VideoProps, 'sources' | 'autoplay'>) => ({
    width: '100%',
    background: `url(${poster}) no-repeat`,
    backgroundSize: 'cover',
    objectFit: 'cover',
    borderRadius: theme.radius.xl,
    ['@media (orientation: portrait)']: {
      ...(maxHeightPortrait && { maxHeight: `${maxHeightPortrait}vh` }),
      ...(aspectRatioPortrait && { aspectRatio: aspectRatioPortrait }),
    },
    ['@media (orientation: landscape)']: {
      ...(aspectRatioLandscape && { aspectRatio: aspectRatioLandscape }),
      ...(maxHeightLandscape && { maxHeight: `${maxHeightLandscape}vh` }),
    },
  }),
)

const autoplaySettings = {
  autoPlay: true,
  muted: true,
  loop: true,
}

export const Video = ({
  sources,
  poster,
  autoplay,
  aspectRatioLandscape,
  aspectRatioPortrait,
  maxHeightLandscape,
  maxHeightPortrait,
}: VideoProps) => {
  const autoplayAttributes = autoplay ? autoplaySettings : {}
  return (
    <VideoWrapper>
      {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/
    */}
      <StyledVideo
        {...autoplayAttributes}
        playsInline
        preload="auto"
        poster={poster}
        aspectRatioLandscape={aspectRatioLandscape}
        aspectRatioPortrait={aspectRatioPortrait}
        maxHeightLandscape={maxHeightLandscape}
        maxHeightPortrait={maxHeightPortrait}
      >
        {sources.map((source) => (
          <source key={source.url} src={source.url} />
        ))}
      </StyledVideo>
    </VideoWrapper>
  )
}
