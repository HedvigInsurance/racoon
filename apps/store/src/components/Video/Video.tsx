import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { theme } from 'ui'

export type VideoSource = {
  url: string
}

export type VideoProps = PropsWithChildren & {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  poster?: string
}

const VideoWrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.space[2],
  paddingRight: theme.space[2],
}))

const StyledVideo = styled.video(({ poster }: Pick<VideoProps, 'poster'>) => ({
  width: '100%',
  background: `url(${poster}) no-repeat`,
  backgroundSize: 'cover',
  objectFit: 'cover',
  borderRadius: theme.radius.xl,
  ['@media (orientation: portrait)']: {
    aspectRatio: '4 / 5',
    maxHeight: '80vh',
  },
  ['@media (orientation: landscape)']: {
    aspectRatio: '1 / 1',
    maxHeight: '90vh',
  },
}))

export const Video = ({ sources, poster }: VideoProps) => {
  return (
    <VideoWrapper>
      {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/
    */}
      <StyledVideo playsInline autoPlay muted loop preload="auto" poster={poster}>
        {sources.map((source) => (
          <source key={source.url} src={source.url} />
        ))}
      </StyledVideo>
    </VideoWrapper>
  )
}
