'use client'

import { useEffect } from 'react'
import * as React from 'react'

export const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (e: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!event.target) {
        return
      }

      if (
        !ref.current ||
        (event.target instanceof Node && ref.current.contains(event.target))
      ) {
        return
      }

      handler(event)
    }

    // 👇 true to ensure it is run during "capturing" phase
    // 👇 thus not incorrectly assuming elements that disappear are outside
    document.addEventListener('mousedown', listener, true)
    document.addEventListener('touchstart', listener, true)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export const useDoubleClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (e: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!event.target) {
        return
      }

      if (
        !ref.current ||
        (event.target instanceof Node && ref.current.contains(event.target))
      ) {
        return
      }

      handler(event)
    }
    document.addEventListener('dblclick', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('dblclick', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
