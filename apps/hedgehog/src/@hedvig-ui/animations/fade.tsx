'use client'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { HTMLAttributes, useState } from 'react'

const fadeOutUpKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(-5%)' },
  })

const fadeOutDownKeyframes = () =>
  keyframes({
    from: { opacity: 1, transform: 'translateY(0)' },
    to: { opacity: 0, transform: 'translateY(5%)' },
  })

const fadeInUpKeyframes = () =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

const fadeInDownKeyframes = () =>
  keyframes({
    from: { opacity: 0, transform: 'translateY(-5%)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  })

const FadeOutWrapper = styled.div<{
  duration?: number
  delay?: number
}>`
  width: 100%;

  .out.up {
    animation: ${fadeOutUpKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-out forwards;
  }

  .out.down {
    animation: ${fadeOutDownKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-out forwards;
  }

  .in.up {
    animation: ${fadeInUpKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-in forwards;
  }

  .in.down {
    animation: ${fadeInDownKeyframes()} ${({ duration = 400 }) => duration}ms
      ease-in forwards;
  }

  animation-delay: ${({ delay = 0 }) => delay}ms;
`

interface UseFadeAnimationVariables {
  duration?: number
}

interface UseFadeAnimationResult {
  fade: (direction: FadeDirection, type: FadeType) => Promise<void>
  props: {
    duration: number
    type: FadeType | null
    direction: FadeDirection | null
  }
}

export const useFadeAnimation = ({
  duration = 500,
}: UseFadeAnimationVariables): UseFadeAnimationResult => {
  const [fadeDirection, setFadeDirection] = useState<FadeDirection | null>(null)
  const [fadeType, setFadeType] = useState<FadeType | null>(null)

  const fade = (direction: FadeDirection, type: FadeType) =>
    new Promise<void>((resolve) => {
      setFadeDirection(direction)
      setFadeType(type)
      setTimeout(() => {
        resolve()
        setFadeType('in')
      }, duration)
    })

  return {
    fade,
    props: {
      direction: fadeDirection,
      type: fadeType,
      duration,
    },
  }
}

export const Fade: React.FC<
  {
    children: React.ReactNode
    duration: number
    type: FadeType | null
    direction: FadeDirection | null
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
> = ({ duration, type, direction, children, ...props }) => {
  return (
    <FadeOutWrapper duration={duration} {...props}>
      <div className={(type ?? '') + ' ' + (direction ?? '')}>{children}</div>
    </FadeOutWrapper>
  )
}

export type FadeDirection = 'up' | 'down'
export type FadeType = 'in' | 'out'
