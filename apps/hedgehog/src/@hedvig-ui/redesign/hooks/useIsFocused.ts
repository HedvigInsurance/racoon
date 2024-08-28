import { useEffect, useState, useRef } from 'react'

export function useIsFocused<T extends HTMLElement>(): [
  boolean,
  React.RefObject<T>,
] {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current

    if (node) {
      const handleFocus = () => setIsFocused(true)
      const handleBlur = () => setIsFocused(false)

      node.addEventListener('focus', handleFocus)
      node.addEventListener('blur', handleBlur)

      return () => {
        node.removeEventListener('focus', handleFocus)
        node.removeEventListener('blur', handleBlur)
      }
    }
  }, [])

  return [isFocused, ref]
}
