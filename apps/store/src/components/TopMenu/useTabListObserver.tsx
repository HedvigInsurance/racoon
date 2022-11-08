import { useEffect, useState } from 'react'

const buildThresholdList = (steps: number) => {
  const thresholds = []
  const numSteps = steps

  for (let i = 1.0; i <= numSteps; i++) {
    const ratio = i / numSteps
    thresholds.push(ratio)
  }

  thresholds.push(0)
  return thresholds
}

export const useTabListObserver = (steps = 120) => {
  const thresholdList = buildThresholdList(steps)

  const [targetElementTop, setTargetElementTop] = useState(0)
  const [targetElementHeight, setTargetElementHeight] = useState(0)

  useEffect(() => {
    const tabListElement = document.querySelector('[role=tablist]')
    if (tabListElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const { top, height } = entry.boundingClientRect
              setTargetElementHeight(height)
              setTargetElementTop(top)
            }
          })
        },
        { threshold: thresholdList, rootMargin: `-${targetElementHeight}px` },
      )
      observer.observe(tabListElement)
      return () => {
        observer.unobserve(tabListElement)
      }
    }
  }, [targetElementHeight, thresholdList])

  const getOffset = () => {
    if (targetElementTop < targetElementHeight) {
      return targetElementTop - targetElementHeight
    }
    return 0
  }

  return { observerTopOffset: getOffset() }
}
