import { useEffect, useRef } from 'react'

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: () => void, delay: number) => {
  // Store the latest callback
  const savedCallback = useRef<() => void | null>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval
  useEffect(() => {
    const tick = () => {
      savedCallback.current?.()
    }
    const intervalId = setInterval(tick, delay)

    return () => clearInterval(intervalId)
  }, [delay])
}
