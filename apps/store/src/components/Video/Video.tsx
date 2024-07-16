import { datadogLogs } from '@datadog/browser-logs'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import clsx from 'clsx'
import { useInView } from 'framer-motion'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { PlayIcon, PauseIcon, Button, visuallyHidden } from 'ui'
import { useDialogEvent } from '@/utils/dialogEvent'
import {
  controlButton,
  soundBar,
  soundBars,
  videoBase,
  videoControls,
  videoControlsVisibility,
  videoRoundedCorners,
  videoWrapper,
  maxHeightPortraitVar,
  aspectRatioLandscapeVar,
  aspectRatioPortraitVar,
  maxHeightLandscapeVar,
  heightLandscapeVar,
  heightPortraitVar,
} from './Video.css'

export enum State {
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
  maxHeightLandscape?: string
  maxHeightPortrait?: string
  roundedCorners?: boolean
}

export type VideoProps = React.ComponentPropsWithoutRef<'video'> & {
  /**
   * An array of videos with different supported formats
   */
  sources: Array<VideoSource>
  poster?: string
  showControls?: boolean
  hideSoundControl?: boolean
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
  hideSoundControl = false,
  ...delegated
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isInView = useInView(videoRef)
  const playButtonId = useId()
  const muteButtonId = useId()
  const playPauseButtonRef = useRef<HTMLButtonElement | null>(null)

  const [state, setState] = useState<State>(State.Paused)
  // Mute video if auto playing or hidden sound controls
  const [muted, setMuted] = useState(delegated.autoPlay || hideSoundControl)

  useLazyLoadVideoPoster(videoRef.current)

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
    <div className={videoWrapper}>
      {/*
    Some special attributes here need more explanation.
    - Safari on iOS only allows autoplay when the video is `muted`.
    - Safari on iOS will default to autoplay videos in fullscreen unless `playsInline` is added
    Read more: https://webkit.org/blog/6784/new-video-policies-for-ios/

    - We don't want to preload full video.  This is ignored by browsers if autoPlay is set
    */}
      <video
        className={clsx(videoBase, roundedCorners && videoRoundedCorners)}
        ref={videoRef}
        data-poster={poster}
        poster={delegated.autoPlay ? poster : undefined}
        playsInline
        preload="metadata"
        onPlaying={handlePlaying}
        onPause={handlePause}
        onEnded={handleVideoEnded}
        muted={muted}
        {...autoplayAttributes}
        {...delegated}
        style={assignInlineVars({
          ...(aspectRatioPortrait && {
            [heightPortraitVar]: aspectRatioPortrait === '100' ? '100vh' : aspectRatioPortrait,
          }),
          ...(maxHeightPortrait && {
            [maxHeightPortraitVar]: `${maxHeightPortrait}vh`,
          }),
          ...(aspectRatioPortrait && {
            [aspectRatioPortraitVar]: aspectRatioPortrait === '100' ? null : aspectRatioPortrait,
          }),
          ...(aspectRatioLandscape && {
            [heightLandscapeVar]: aspectRatioLandscape === '100' ? '100vh' : aspectRatioLandscape,
          }),
          ...(maxHeightLandscape && {
            [maxHeightLandscapeVar]: `${maxHeightLandscape}vh`,
          }),
          ...(aspectRatioLandscape && {
            [aspectRatioLandscapeVar]: aspectRatioLandscape === '100' ? null : aspectRatioLandscape,
          }),
        })}
      >
        {sources.map((source) => {
          const sourceProps = {
            src: delegated.autoPlay ? '' : source.url,
            ...(delegated.autoPlay && { 'data-src': source.url }),
          }
          const videoType = source.url.split('.').pop()
          return <source key={source.url} type={`video/${videoType}`} {...sourceProps} />
        })}
      </video>
      {showControls && (
        <div
          className={videoControls}
          data-state={state}
          data-muted={muted}
          onClick={() => playPauseButtonRef.current?.click()}
        >
          <div className={videoControlsVisibility}>
            <Button
              className={controlButton}
              ref={playPauseButtonRef}
              onClick={togglePlay}
              variant="secondary"
              size="small"
              aria-labelledby={playButtonId}
              hiddenText={
                <span id={playButtonId} className={visuallyHidden}>
                  {state === State.Paused ? 'Play' : 'Pause'}
                </span>
              }
              Icon={state === State.Paused ? <PlayIcon size="1rem" /> : <PauseIcon size="1rem" />}
            />
            {!hideSoundControl && (
              <Button
                className={controlButton}
                onClick={toggleSound}
                variant="secondary"
                size="small"
                aria-labelledby={muteButtonId}
                hiddenText={
                  <span id={muteButtonId} className={visuallyHidden}>
                    {muted ? 'Mute' : 'Unmute'}
                  </span>
                }
                Icon={
                  <div className={soundBars}>
                    <span className={soundBar} />
                    <span className={soundBar} />
                    <span className={soundBar} />
                  </div>
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// TODO: remove this logic when native support for lazy load video poster gets added
// https://github.com/whatwg/html/pull/8428
const useLazyLoadVideoPoster = (videoElement: HTMLVideoElement | null) => {
  useEffect(() => {
    if (!videoElement) return

    if (!('IntersectionObserver' in window)) {
      const poster = videoElement.getAttribute('data-poster')
      if (poster) {
        videoElement.setAttribute('poster', poster)
      }

      return datadogLogs.logger.info(
        'InterserctionObserver API not supported. Skipping lazy loading for video poster',
      )
    }

    const intesectionObserverCb = (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target
          const poster = video.getAttribute('data-poster')

          if (poster) {
            video.setAttribute('poster', poster)
            video.removeAttribute('data-poster')
          }
        }
      })
    }

    const lazyLoadPosterObserver = new IntersectionObserver(intesectionObserverCb, {
      // should fetch poster when it's 50% of screen height away of being visible
      rootMargin: '0% 0% 50% 0%',
    })
    lazyLoadPosterObserver.observe(videoElement)

    return () => lazyLoadPosterObserver.disconnect()
  }, [videoElement])
}
