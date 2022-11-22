import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

export type VideoSource = {
  url: string
}

type HeroVideoProps = PropsWithChildren & {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  poster?: string
}

const VideoWrapper = styled.div({
  position: 'relative',
})

const StyledVideo = styled.video({
  width: '100%',
  height: 'auto',
  backgroundSize: 'cover',
  objectFit: 'cover',
})

export const Video = ({ sources, poster }: HeroVideoProps) => {
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
