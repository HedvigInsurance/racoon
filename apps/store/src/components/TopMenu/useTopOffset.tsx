import { useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export const useTopOffset = () => {
  const { scrollY } = useScroll()
  const [state, setState] = useState({
    targetElementTop: 0,
    navHeight: 0,
  })

  const navRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    scrollY.onChange(() => {
      const tabListElement = document.querySelector('[role=tablist]')
      if (tabListElement) {
        const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
        const { top } = tabListElement.getBoundingClientRect()
        setState({
          targetElementTop: top,
          navHeight,
        })
      }
    })
    return () => {
      scrollY.destroy()
    }
  }, [scrollY])

  const getTopOffset = () => {
    if (state.targetElementTop < state.navHeight) {
      return (state.navHeight - state.targetElementTop) * -1
    }
    return 0
  }

  return { topOffset: getTopOffset(), navRef }
}
