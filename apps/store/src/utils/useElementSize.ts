import { useIsomorphicLayoutEffect } from 'framer-motion'
import { type RefObject, useCallback, useState } from 'react'

// Heavily inspired by
// https://github.com/juliencrn/usehooks-ts/blob/master/packages/usehooks-ts/src/useResizeObserver/useResizeObserver.ts
export const useElementSize = <E extends HTMLElement>(elementRef: RefObject<E>) => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const handleResize: ResizeObserverCallback = useCallback((resizeEntry) => {
    setSize((prevSize) => {
      const width = resizeEntry[0].borderBoxSize[0].inlineSize
      const height = resizeEntry[0].borderBoxSize[0].blockSize
      // Prevent rerenders by returning old value if unchanged
      if (width === prevSize.width && height === prevSize.height) {
        return prevSize
      } else {
        return { width, height }
      }
    })
  }, [])
  useIsomorphicLayoutEffect(() => {
    const observer = new ResizeObserver(handleResize)
    if (elementRef.current != null) {
      observer.observe(elementRef.current)
    }
    return () => observer.disconnect()
  }, [elementRef, handleResize])
  return size
}
