'use client'

import { isPressing, Keys } from '@hedvig-ui'
import {
  useKeyboardListener,
  UseVerticalKeyboardNavigationProps,
} from '@hedvig-ui'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const handleStepChange = (
  setIndex: Dispatch<SetStateAction<number>>,
  isWithinBounds: (currentIndex: number) => boolean,
  delta: number,
) => {
  setIndex((currentIndex) => {
    if (isWithinBounds(currentIndex)) {
      return currentIndex + delta
    } else {
      return currentIndex
    }
  })
}

export const useVerticalKeyboardNavigation = ({
  maxStep,
  onNavigationStep,
  onPerformNavigation,
  onExit,
  isActive = false,
}: UseVerticalKeyboardNavigationProps): [number, () => void] => {
  const [navigationIndex, setNavigationIndex] = useState(-1)
  const reset = () => {
    setNavigationIndex(-1)
  }

  useKeyboardListener(isActive, (e) => {
    if (
      navigationIndex !== -1 &&
      isPressing(e, Keys.Enter) &&
      onPerformNavigation
    ) {
      e.preventDefault()
      onPerformNavigation(navigationIndex)
      return
    }

    if (isPressing(e, Keys.Up)) {
      e.preventDefault()
      if (navigationIndex === 0 && onExit) {
        onExit()
      }
      handleStepChange(setNavigationIndex, (i) => i > -1, -1)
      return
    }

    if (isPressing(e, Keys.Down)) {
      e.preventDefault()
      handleStepChange(setNavigationIndex, (i) => i < maxStep, 1)
      return
    }
  })

  useEffect(() => {
    if (onNavigationStep && navigationIndex !== -1) {
      onNavigationStep()
    }
  }, [navigationIndex, onNavigationStep])

  return [navigationIndex, reset]
}
