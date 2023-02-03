import styled from '@emotion/styled'
import React, { useCallback, useId, useRef, useState } from 'react'
import { mq, theme, PlayIcon, PauseIcon, Button } from 'ui'
import { useDialogEvent } from '@/utils/dialogEvent'

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
  onPlaying,
  onPause,
  ...delegated
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playButtonId = useId()
  const playPauseButtonRef = useRef<HTMLButtonElement | null>(null)

  const [state, setState] = useState<State>(State.Paused)

  const autoplayAttributes = delegated.autoPlay ? autoplaySettings : {}

  const playVideo = useCallback(() => {
    videoRef.current?.play()
    setState(State.Playing)
  }, [])

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause()
    setState(State.Paused)
  }, [])

  const togglePlay = useCallback(() => {
    if (state === State.Paused) {
      playVideo()
    } else {
      pauseVideo()
    }
  }, [state, playVideo, pauseVideo])

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

  const [wasPlaying, setWasPlaying] = useState(false)
  const handleDialogOpen = useCallback(() => {
    if (state === State.Playing) {
      setWasPlaying(true)
      pauseVideo()
    }
  }, [state, pauseVideo])
  useDialogEvent('open', handleDialogOpen)

  const handleDialogClose = useCallback(() => {
    if (wasPlaying) {
      setWasPlaying(false)
      playVideo()
    }
  }, [wasPlaying, playVideo])
  useDialogEvent('close', handleDialogClose)

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
      <VideoControls data-state={state} onClick={() => playPauseButtonRef.current?.click()}>
        <Controls>
          <PlayPauseButton
            ref={playPauseButtonRef}
            onClick={togglePlay}
            variant="secondary"
            size="small"
            aria-labelledby={playButtonId}
          >
            {state === State.Paused ? <PlayIcon size="1rem" /> : <PauseIcon size="1rem" />}
            <span id={playButtonId} hidden>
              {state === State.Paused ? 'Play' : 'Pause'}
            </span>
          </PlayPauseButton>
        </Controls>
      </VideoControls>
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

const VideoControls = styled.div({
  cursor: 'pointer',
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.space.md,
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
})

const Controls = styled.div({
  '@media (hover: hover)': {
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1) 2s',
    [`${VideoControls}[data-state=${State.Paused}] > &, ${VideoControls}:hover > &`]: {
      opacity: 1,
      visibility: 'visible',
      transitionDelay: '0s',
    },
  },
})

const PlayPauseButton = styled(Button)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.xs,
  height: '2rem',
  paddingInline: theme.space.xs,
})
