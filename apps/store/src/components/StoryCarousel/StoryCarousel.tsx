import { assignInlineVars } from '@vanilla-extract/dynamic'
import { clsx } from 'clsx'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import { useState, useEffect, useCallback } from 'react'
import {
  storyCarousel,
  imageSequenceProgressBar,
  progressSegment,
  progressSegmentFillRunning,
  progressSegmentFillFinished,
  fillAnimationDuration,
  stepper,
  img,
} from './StoryCarousel.css'

const DEFAULT_TIMER_DURATION_IN_SECONDS = 3

type Image = {
  id: string
  src: string
  alt: string
}

type StoryCarouselProps = {
  images: Array<Image>
  /**
   * Duration in seconds for each image to be displayed
   */
  duration?: number
  className?: string
}

export function StoryCarousel({
  images,
  duration = DEFAULT_TIMER_DURATION_IN_SECONDS,
  className,
}: StoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()

  const stepBack = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }, [])

  const stepForward = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  // Automatically step forward every `duration` seconds
  useEffect(() => {
    const timeoutId = setTimeout(stepForward, duration * 1000)
    return () => clearTimeout(timeoutId)
  }, [activeIndex, stepForward, duration])

  const image = images[activeIndex]

  return (
    <div className={clsx(storyCarousel, className)}>
      <div className={imageSequenceProgressBar}>
        {images.map((image, index) => (
          <ProgressSegment
            key={image.id}
            index={index}
            activeImageIndex={activeIndex}
            duration={duration}
          />
        ))}
      </div>

      <button
        className={stepper}
        data-side="left"
        aria-label={t('STORY_CAROUSEL_PREVIOUS_BUTTON_LABEL')}
        onClick={stepBack}
        disabled={activeIndex === 0}
      />

      <Image className={img} src={image.src} alt={image.alt} fill={true} objectFit="cover" />

      <button
        className={stepper}
        data-side="right"
        aria-label={t('STORY_CAROUSEL_NEXT_BUTTON_LABEL')}
        onClick={stepForward}
      />
    </div>
  )
}

type ProgressSegmentProps = {
  index: number
  activeImageIndex: number
  duration: number
}

function ProgressSegment({ index, activeImageIndex, duration }: ProgressSegmentProps) {
  let state: 'idle' | 'running' | 'finished' = 'idle'
  if (index === activeImageIndex) {
    state = 'running'
  } else if (index < activeImageIndex) {
    state = 'finished'
  }

  return (
    <div
      style={assignInlineVars({
        [fillAnimationDuration]: `${duration}s`,
      })}
      className={clsx(
        progressSegment,
        state === 'running' && progressSegmentFillRunning,
        state === 'finished' && progressSegmentFillFinished,
      )}
    />
  )
}
