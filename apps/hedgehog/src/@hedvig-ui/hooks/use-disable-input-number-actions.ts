'use client'

import { useEffect } from 'react'

export function useDisableInputWheel(
  input: HTMLInputElement | null | undefined,
) {
  useEffect(() => {
    if (!input || input.type !== 'number') {
      return
    }
    input.addEventListener('wheel', disableWheel)

    return () => input.removeEventListener('wheel', disableWheel)
  }, [input])
}

export function useDisableInputUpDownKeys(
  input: HTMLInputElement | null | undefined,
) {
  useEffect(() => {
    if (!input || input.type !== 'number') {
      return
    }
    input.addEventListener('keydown', disableUpDownKeys)

    return () => input.removeEventListener('keydown', disableUpDownKeys)
  }, [input])
}

function disableWheel(e: WheelEvent) {
  e.preventDefault()
}

function disableUpDownKeys(e: KeyboardEvent) {
  const DISABLED_KEYS = ['ArrowUp', 'ArrowDown']
  if (DISABLED_KEYS.includes(e.key)) {
    e.preventDefault()
  }
}
