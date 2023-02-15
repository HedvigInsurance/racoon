import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

export type VideoSource = {
  url: string
  /**
   * For example "video/mp4"
   */
  format: string
}

type HeroVideoProps = PropsWithChildren & {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  /**
   * The poster image of the video that will be displayed while the video is being loaded, or it the browser doesn't support any of the formats
   */
  poster?: string
  height?: number
  childrenPadding?: string
}

const HeroVideoWrapper = styled.div({
  position: 'relative',
})

const ChildrenWrapper = styled.div(
  ({ childrenPadding }: Pick<HeroVideoProps, 'childrenPadding'>) => ({
    position: 'absolute',
    top: childrenPadding ?? '50%',
    width: '100%',
  }),
)

const StyledVideo = styled.video(
  ({ poster, height }: Pick<HeroVideoProps, 'poster' | 'height'>) => ({
    width: '100%',
    height: height ?? '80vh',
    ...(poster && {
      background: `url(${poster}) no-repeat`,
      backgroundSize: 'cover',
      objectFit: 'cover',
    }),
  }),
)

export const HeroVideo = ({
  sources,
  poster,
  height,
  children,
  childrenPadding,
}: HeroVideoProps) => (
  <HeroVideoWrapper>
    {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/
    */}
    <StyledVideo playsInline autoPlay muted loop preload="auto" poster={poster} height={height}>
      {sources.map((source) => (
        <source key={source.format || source.url} src={source.url} type={source.format} />
      ))}
    </StyledVideo>
    <ChildrenWrapper childrenPadding={childrenPadding}>{children}</ChildrenWrapper>
  </HeroVideoWrapper>
)
