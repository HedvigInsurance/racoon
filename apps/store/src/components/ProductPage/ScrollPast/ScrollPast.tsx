import styled from '@emotion/styled'
import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

export type ScrollPastProps = {
  targetRef: React.RefObject<HTMLElement>
  children: React.ReactNode
}

export const ScrollPast = ({ targetRef, children }: ScrollPastProps) => {
  const { scrollY } = useScroll()

  const [hasScrolledPassed, setHasScrolledPassed] = useState(false)
  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (targetRef.current) {
        const elementEnd = targetRef.current.offsetTop + targetRef.current.clientHeight
        setHasScrolledPassed(latest > elementEnd)
      }
    })
  }, [scrollY, targetRef])

  return (
    <StyledWrapper
      variants={{
        hidden: { opacity: 0, transitionEnd: { display: 'none' } },
        visible: { opacity: 1, display: 'flex' },
      }}
      initial="hidden"
      animate={hasScrolledPassed ? 'visible' : 'hidden'}
    >
      {children}
    </StyledWrapper>
  )
}

const StyledWrapper = styled(motion.div)({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
})
