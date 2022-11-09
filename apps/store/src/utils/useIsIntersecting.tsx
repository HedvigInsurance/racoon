import { useEffect, useState } from 'react'

export const useIsIntersecting = (node: Element | null, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  useEffect(() => {
    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsIntersecting(entry.isIntersecting)
          })
        },
        { ...options },
      )
      observer.observe(node)
      return () => observer.disconnect()
    }
  }, [node, options])

  return [isIntersecting] as const
}
