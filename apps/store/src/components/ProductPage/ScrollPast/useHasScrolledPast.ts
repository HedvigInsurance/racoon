import { useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'

export const useHasScrolledPast = ({ targetRef }: { targetRef: React.RefObject<HTMLElement> }) => {
  const { scrollY } = useScroll()

  const [hasScrolledPassed, setHasScrolledPassed] = useState(false)
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (targetRef.current) {
        const elementEnd = targetRef.current.offsetTop + targetRef.current.clientHeight
        setHasScrolledPassed(latest > elementEnd)
      }
    })
  }, [scrollY, targetRef])

  return hasScrolledPassed
}
