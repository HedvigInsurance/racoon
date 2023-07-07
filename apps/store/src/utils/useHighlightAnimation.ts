import { type KeyboardEvent, useCallback, useRef } from 'react'
import { theme } from 'ui'

const SIGNAL_GREEN_FILL_HSLA = theme.colors.signalGreenFill
  .replace('hsl', 'hsla')
  .replace(')', ', 0.99)')

type Params = {
  defaultColor?: string
}

export const useHighlightAnimation = <Element extends HTMLElement>({
  defaultColor = theme.colors.translucent1,
}: Params = {}) => {
  const ref = useRef<Element | null>(null)

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
          { backgroundColor: defaultColor, easing: 'ease-out' },
        ],
        {
          duration: 1200,
        },
      )
    },
    [ref, defaultColor],
  )

  return { highlight, animationProps: { ref } } as const
}

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
