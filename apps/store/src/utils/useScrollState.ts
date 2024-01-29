import { useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

type Params = { threshold?: number }

type State = 'ABOVE' | 'BELOW' | 'SCROLL_UP' | 'SCROLL_DOWN' | 'TOP'

export const useScrollState = ({ threshold = 0 }: Params) => {
  const [scrollState, setScrollState] = useState<State>('ABOVE')
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (latest === 0) return setScrollState('TOP')

      let isScrollingDown = false
      const previousY = scrollY.getPrevious()
      if (previousY) {
        isScrollingDown = previousY - latest < 0
      }

      const isAbove = latest <= threshold

      if (isAbove) {
        return setScrollState((prev) => {
          return prev === 'SCROLL_UP' ? 'SCROLL_UP' : 'ABOVE'
        })
      }

      return setScrollState((prev) => {
        if (isScrollingDown) {
          if (prev === 'ABOVE' || prev === 'BELOW') return 'BELOW'

          return 'SCROLL_DOWN'
        }

        return 'SCROLL_UP'
      })
    })
  }, [scrollY, threshold])

  return scrollState
}
