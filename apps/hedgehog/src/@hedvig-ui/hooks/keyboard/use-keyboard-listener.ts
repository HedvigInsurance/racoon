'use client'

import { useEffect } from 'react'

export type KeyDownHandler = (e: KeyboardEvent) => void

export const useKeyboardListener = (
  isActive: boolean,
  handler: KeyDownHandler,
) => {
  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      if (isActive) {
        handler(e)
      }
    }

    window.addEventListener('keydown', eventHandler)

    return () => {
      window.removeEventListener('keydown', eventHandler)
    }
  }, [isActive, handler])
}

export type PerformNavigationHandler = (index: number) => void
export type NavigationStepHandler = () => void
export interface UseVerticalKeyboardNavigationProps {
  maxStep: number
  onPerformNavigation?: PerformNavigationHandler
  onNavigationStep?: NavigationStepHandler
  onExit?: () => void
  isActive?: boolean
}
