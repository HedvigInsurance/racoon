import { useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useIsIntersecting } from '@/utils/useIsIntersecting'

export const useStickyTopMenuOffset = () => {
  const [topOffset, setTopOffset] = useState(0)
  const [targetNode, setTargetNode] = useState<Element | null>(null)
  const { scrollY } = useScroll()
  const [isTargetNodeIntersecting] = useIsIntersecting(targetNode)
  const navRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setTargetNode(document.querySelector('[role=tablist]'))

    if (targetNode && isTargetNodeIntersecting) {
      scrollY.onChange(() => {
        const { top: targetNodeTop } = targetNode.getBoundingClientRect()
        const navHeight = navRef.current?.getBoundingClientRect().height ?? 0
        const calculatedOffset = -(targetNodeTop < navHeight ? navHeight - targetNodeTop : 0)
        setTopOffset(calculatedOffset)
      })
      return () => scrollY.destroy()
    }
  }, [isTargetNodeIntersecting, scrollY, targetNode])

  return { topOffset, navRef }
}
