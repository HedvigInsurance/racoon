import { useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'

export const useHasScrolledPast = ({
  targetRef,
  offset = 0,
}: {
  targetRef: React.RefObject<HTMLElement>
  offset?: number
}) => {
  const { scrollY } = useScroll()

  const [hasScrolledPassed, setHasScrolledPassed] = useState(false)
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      if (targetRef.current) {
        const elementEnd = targetRef.current.offsetTop + targetRef.current.clientHeight + offset
        setHasScrolledPassed(latest > elementEnd)
      }
    })
  }, [scrollY, targetRef, offset])

  return hasScrolledPassed
}
