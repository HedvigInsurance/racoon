// Delay execution with requestIdleCallback. Fallback to requestAnimationFrame (RIC not supported in Safari)
import { useEffect } from 'react'

export const useIdleCallback = (callback: () => void) => {
  useEffect(() => {
    let schedule
    let cancel
    if (typeof window.requestIdleCallback === 'function') {
      schedule = window.requestIdleCallback
      cancel = window.cancelIdleCallback
    } else {
      schedule = window.requestAnimationFrame
      cancel = window.cancelAnimationFrame
    }
    const callbackId = schedule(callback)
    return () => cancel(callbackId)
  }, [callback])
}
