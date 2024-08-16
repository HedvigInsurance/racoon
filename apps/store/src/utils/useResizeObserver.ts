import { useIsomorphicLayoutEffect } from 'framer-motion'
import { type RefObject, useRef } from 'react'

// Simplified version, heavily inspired by
// https://github.com/juliencrn/usehooks-ts/blob/master/packages/usehooks-ts/src/useResizeObserver/useResizeObserver.ts
type Options<E> = {
  elementRef: RefObject<E>
  onResize: ResizeObserverCallback
}
export const useResizeObserver = <E extends HTMLElement>(options: Options<E>) => {
  const callbackRef = useRef<ResizeObserverCallback>(options.onResize)
  callbackRef.current = options.onResize

  useIsomorphicLayoutEffect(() => {
    const observer = new ResizeObserver((...args) => callbackRef.current(...args))
    if (options.elementRef.current != null) {
      observer.observe(options.elementRef.current)
    }
    return () => observer.disconnect()
  }, [options.elementRef])
}
