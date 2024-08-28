'use client'

import { type ForwardedRef, useRef, useEffect } from 'react'

export const useForwardRef = <T>(
  ref: ForwardedRef<T>,
  initialValue: T | null = null,
) => {
  const targetRef = useRef<T>(initialValue)

  useEffect(() => {
    if (!ref) return

    if (typeof ref === 'function') {
      ref(targetRef.current)
    } else {
      ref.current = targetRef.current
    }
  }, [ref])

  return targetRef
}
