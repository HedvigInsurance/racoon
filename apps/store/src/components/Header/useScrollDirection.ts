import { useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

type Params = { threshold?: number }

export const useScrollDirection = ({ threshold = 0 }: Params) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (latest < threshold) return setScrollDirection(null)

      const isScrollingDown = scrollY.getPrevious() - latest < 0
      setScrollDirection(isScrollingDown ? 'down' : 'up')
    })
  }, [scrollY, threshold])

  return scrollDirection
}
