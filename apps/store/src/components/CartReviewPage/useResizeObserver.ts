import { useState, useEffect, useLayoutEffect } from 'react'

const defaultSize = { height: 0, width: 0 }

// Based on https://github.com/streamich/react-use/blob/master/src/useMeasure.ts
export const useResizeObserver = () => {
  const [element, ref] = useState<Element | null>(null)
  const [size, setSize] = useState(defaultSize)

  useIsomorphicLayoutEffect(() => {
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.borderBoxSize[0]) {
        const { blockSize, inlineSize } = entries[0].borderBoxSize[0]
        setSize({ height: blockSize, width: inlineSize })
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return [ref, size] as const
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
