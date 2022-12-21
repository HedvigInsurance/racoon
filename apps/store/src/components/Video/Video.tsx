import styled from '@emotion/styled'
import React, { useCallback, useRef, useState } from 'react'
import { mq, theme, Button, PlayIcon, PauseIcon } from 'ui'

enum State {
  Playing = 'playing',
  Paused = 'paused',
}

type VideoSource = {
  url: string
}

type VideoSize = {
  aspectRatioLandscape?: '1 / 1' | '16 / 9'
  aspectRatioPortrait?: '4 / 5' | '4 / 6'
  maxHeightLandscape?: number
  maxHeightPortrait?: number
}

export type VideoProps = React.ComponentPropsWithoutRef<'video'> & {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  poster?: string
} & VideoSize

const autoplaySettings = {
  autoPlay: true,
  muted: true,
  loop: true,
}

export const Video = ({
  sources,
  poster,
  aspectRatioLandscape,
  aspectRatioPortrait,
  maxHeightLandscape,
  maxHeightPortrait,
  controls,
  onPlaying,
  onPause,
  ...delegated
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playPauseButtonRef = useRef<HTMLButtonElement | null>(null)

  const [state, setState] = useState<State>(State.Paused)

  const autoplayAttributes = delegated.autoPlay ? autoplaySettings : {}

  const togglePlay = useCallback(() => {
    if (state === State.Paused) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  }, [state])

  const handlePlaying: React.ReactEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      setState(State.Playing)
      onPlaying?.(event)
    },
    [setState, onPlaying],
  )

  const handlePause: React.ReactEventHandler<HTMLVideoElement> = useCallback(
    (event) => {
      setState(State.Paused)
      onPause?.(event)
    },
    [setState, onPause],
  )

  return (
    <VideoWrapper>
      {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/
    */}
      <StyledVideo
        ref={videoRef}
        playsInline
        preload="auto"
        poster={poster}
        aspectRatioLandscape={aspectRatioLandscape}
        aspectRatioPortrait={aspectRatioPortrait}
        maxHeightLandscape={maxHeightLandscape}
        maxHeightPortrait={maxHeightPortrait}
        onPlaying={handlePlaying}
        onPause={handlePause}
        {...autoplayAttributes}
        {...delegated}
      >
        {sources.map((source) => (
          // TODO: its adivided to provide the media format type ('type' attribute)
          // More info http://bitly.ws/y4Jf
          <source key={source.url} src={source.url} />
        ))}
      </StyledVideo>
      {controls && (
        <VideoControls data-state={state} onClick={() => playPauseButtonRef.current?.click()}>
          <Controls>
            <Button
              ref={playPauseButtonRef}
              icon={state === State.Paused ? <PlayIcon size="1rem" /> : <PauseIcon size="1rem" />}
              onClick={togglePlay}
              color="light"
            >
              {state === State.Paused ? 'Play' : null}
            </Button>
          </Controls>
        </VideoControls>
      )}
    </VideoWrapper>
  )
}

const VideoWrapper = styled.div({
  position: 'relative',
})

const StyledVideo = styled.video(
  ({
    poster,
    aspectRatioLandscape,
    aspectRatioPortrait,
    maxHeightLandscape,
    maxHeightPortrait,
  }: Omit<VideoProps, 'sources'>) => ({
    width: '100%',
    background: `url(${poster}) no-repeat`,
    backgroundSize: 'cover',
    objectFit: 'cover',
    borderRadius: theme.radius.md,
    ['@media (orientation: portrait)']: {
      ...(maxHeightPortrait && { maxHeight: `${maxHeightPortrait}vh` }),
      ...(aspectRatioPortrait && { aspectRatio: aspectRatioPortrait }),
    },
    ['@media (orientation: landscape)']: {
      ...(aspectRatioLandscape && { aspectRatio: aspectRatioLandscape }),
      ...(maxHeightLandscape && { maxHeight: `${maxHeightLandscape}vh` }),
    },
    [mq.lg]: {
      borderRadius: theme.radius.xl,
    },
  }),
)

const VideoControls = styled.div(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.space[3],
  [`&[data-state="${State.Paused}"]`]: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  [`&[data-state="${State.Playing}"]`]: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
}))

const Controls = styled.div({
  opacity: 0,
  visibility: 'hidden',
  [`${VideoControls}[data-state=${State.Paused}] > &, ${VideoControls}:hover > &`]: {
    opacity: 1,
    visibility: 'visible',
  },
})
