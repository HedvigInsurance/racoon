import { useEffect, useState } from 'react'

export const LOAD_CHAR_INTERVAL = 150

type Params = {
  value: string
  onValueChange: (value: string) => void
}

export const usePrintTextEffect = ({ value, onValueChange }: Params) => {
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (charIndex >= value.length) return

    const tick = () => {
      onValueChange(value.slice(0, charIndex + 1))
      setCharIndex(charIndex + 1)
    }

    const handle = window.setTimeout(tick, LOAD_CHAR_INTERVAL)

    return () => window.clearTimeout(handle)
  }, [value, charIndex, onValueChange])
}
