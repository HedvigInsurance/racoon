import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useInView } from 'framer-motion'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { mq, theme, PlayIcon, PauseIcon, Button } from 'ui'
import { useDialogEvent } from '@/utils/dialogEvent'

enum State {
  Playing = 'playing',
  Paused = 'paused',
}

type VideoSource = {
  url: string
}

type AspectRatioLandscape = '1 / 1' | '16 / 9' | '100'
type AspectRatioPortrait = '4 / 5' | '4 / 6' | '9 / 16' | '100'

type VideoSize = {
  aspectRatioLandscape?: AspectRatioLandscape
  aspectRatioPortrait?: AspectRatioPortrait
  maxHeightLandscape?: number
  maxHeightPortrait?: number
  roundedCorners?: boolean
}

export type VideoProps = React.ComponentPropsWithoutRef<'video'> & {
  /**
   * An array of videos with different supported formats
   */
  sources: VideoSource[]
  poster?: string
  showControls?: boolean
} & VideoSize

const autoplaySettings = {
  autoPlay: true,
  loop: true,
}

const missingPosters = new Set()
export const Video = ({
  sources,
  poster,
  aspectRatioLandscape,
  aspectRatioPortrait,
  maxHeightLandscape,
  maxHeightPortrait,
  roundedCorners,
  onPlaying,
  onPause,
  showControls = true,
  ...delegated
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isInView = useInView(videoRef)
  const playButtonId = useId()
  const muteButtonId = useId()
  const playPauseButtonRef = useRef<HTMLButtonElement | null>(null)

  const [state, setState] = useState<State>(State.Paused)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    // Lazy load videos that are autoplaying
    if (isInView && videoRef.current) {
      Array.from(videoRef.current.children).map((videoSource) => {
        if (videoSource instanceof HTMLSourceElement && videoSource.dataset.src) {
          videoSource.src = videoSource.dataset.src
        }
      })

      videoRef.current.load()
    }
  }, [isInView])

  const videoUrl = sources[0].url
  useEffect(() => {
    if (!poster && !missingPosters.has(videoUrl)) {
      console.log('Video block has no poster', videoUrl)
      missingPosters.add(videoUrl)
    }
  }, [poster, videoUrl])

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

  const toggleSound: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()

    if (!videoRef.current) {
      return
    }

    if (muted) {
      videoRef.current.muted = false
    } else {
      videoRef.current.muted = true
    }

    setMuted((current) => !current)
  }

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

  const handleVideoEnded: React.ReactEventHandler<HTMLVideoElement> = () => {
    // Show the first frame of the video when it has ended
    if (videoRef.current) {
      videoRef.current.pause()
      setState(State.Paused)
      videoRef.current.currentTime = 0
    }
  }

  return (
    <VideoWrapper>
      {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/

    - We don't want to preload full video.  This is ignored by browsers if autoPlay is set
    */}
      <StyledVideo
        ref={videoRef}
        playsInline
        preload="metadata"
        poster={poster}
        aspectRatioLandscape={aspectRatioLandscape}
        aspectRatioPortrait={aspectRatioPortrait}
        maxHeightLandscape={maxHeightLandscape}
        maxHeightPortrait={maxHeightPortrait}
        roundedCorners={roundedCorners}
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={handleVideoEnded}
        muted={muted}
        {...autoplayAttributes}
        {...delegated}
      >
        {sources.map((source) => {
          const sourceProps = {
            src: delegated.autoPlay ? '' : source.url,
            ...(delegated.autoPlay && { 'data-src': source.url }),
          }
          const videoType = source.url.split('.').pop()
          return <source key={source.url} type={`video/${videoType}`} {...sourceProps} />
        })}
      </StyledVideo>
      {showControls && (
        <VideoControls
          data-state={state}
          data-muted={muted}
          onClick={() => playPauseButtonRef.current?.click()}
        >
          <Controls>
            <ControlButton
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
            </ControlButton>
            <ControlButton
              onClick={toggleSound}
              variant="secondary"
              size="small"
              aria-labelledby={muteButtonId}
            >
              <SoundBars>
                <span />
                <span />
                <span />
              </SoundBars>
              <span id={muteButtonId} hidden>
                {muted ? 'Mute' : 'Unmute'}
              </span>
            </ControlButton>
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
    roundedCorners,
  }: Omit<VideoProps, 'sources'>) => ({
    width: '100%',
    objectFit: 'cover',
    ...(poster && {
      background: `url(${poster}) no-repeat`,
      backgroundSize: 'cover',
    }),
    ['@media (orientation: portrait)']: {
      ...(maxHeightPortrait && { maxHeight: `${maxHeightPortrait}vh` }),
      ...(aspectRatioPortrait && getAspectRatio(aspectRatioPortrait)),
    },
    ['@media (orientation: landscape)']: {
      ...(aspectRatioLandscape && getAspectRatio(aspectRatioLandscape)),
      ...(maxHeightLandscape && { maxHeight: `${maxHeightLandscape}vh` }),
    },

    ...(roundedCorners && {
      borderRadius: theme.radius.md,
      [mq.lg]: {
        borderRadius: theme.radius.xl,
      },
    }),
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
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
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

const ControlButton = styled(Button)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.space.xs,
  height: '2rem',
  paddingInline: theme.space.xs,
  backgroundColor: theme.colors.grayTranslucentDark700,

  '@media (hover: hover)': {
    ':hover': {
      backgroundColor: theme.colors.grayTranslucentDark600,
    },
  },

  ':active': {
    backgroundColor: theme.colors.grayTranslucentDark600,
  },
})

const soundBarsAnimation = keyframes({
  '50%': { opacity: 0.2, transform: 'scaleY(.2)' },
  '100%': { opacity: 1, transform: 'scaleY(0.9)' },
})

const SoundBars = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '16px',
  width: '16px',
  paddingBottom: '2px',

  span: {
    margin: 'auto 1px 0',
    height: '14px',
    width: '2px',
    borderRadius: '2px',
    transform: 'scaleY(.2)',
    transformOrigin: 'bottom',
    backgroundColor: theme.colors.gray1000,
    transition: 'all .4s ease-in-out',

    [`${VideoControls}[data-muted=false] &`]: {
      animation: `${soundBarsAnimation} 1s 2 alternate`,
      '&:nth-child(1)': { transform: 'scaleY(.85)', animationDelay: '.4s' },
      '&:nth-child(2)': { transform: 'scaleY(.43)', animationDelay: '.2s' },
      '&:nth-child(3)': { transform: 'scaleY(.72)', animationDelay: '.6s' },
    },
  },
})

const getAspectRatio = (aspectRatio: AspectRatioLandscape | AspectRatioPortrait) => {
  switch (aspectRatio) {
    case '100':
      return { height: '100vh' }
    default:
      return { aspectRatio: aspectRatio }
  }
}
