'use client'

import { type KeyboardEvent, useCallback, useRef, useState, useEffect } from 'react'
import { theme } from '../theme/theme'

const SIGNAL_GREEN_FILL_HSLA = theme.colors.signalGreenFill
  .replace('hsl', 'hsla')
  .replace(')', ', 0.99)')

const EXCLUDE_SET = new Set([
  'Tab',
  'Enter',
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'Shift',
  'Alt',
  'Meta',
  'Control',
])

export function useHighlightAnimation<Element extends HTMLElement>() {
  const ref = useRef<Element | null>(null)
  const [backgroundColor, setBackgroundColor] = useState<string>(theme.colors.translucent1)

  useEffect(() => {
    if (!ref.current) return

    const elementBackgroundColor = getComputedStyle(ref.current).backgroundColor
    setBackgroundColor(elementBackgroundColor)
  }, [])

  const highlight = useCallback(
    (event?: KeyboardEvent<Element>) => {
      if (event && EXCLUDE_SET.has(event.key)) return

      ref.current?.animate(
        [
          {
            backgroundColor: SIGNAL_GREEN_FILL_HSLA,
            easing: 'cubic-bezier(0.65, 0.05, 0.36, 1)',
            offset: 0.2,
          },
          {
            backgroundColor: SIGNAL_GREEN_FILL_HSLA,
          },
          { backgroundColor, easing: 'ease-out' },
        ],
        {
          duration: 1200,
        },
      )
    },
    [ref, backgroundColor],
  )

  return { highlight, animationProps: { ref } } as const
}
