import { useEffect, useState } from 'react'

export const LOAD_CHAR_INTERVAL = 150

type PrintCodeEffectParams = {
  initialCode: string
}

export const usePrintCodeEffect = ({ initialCode }: PrintCodeEffectParams) => {
  const [code, setCode] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (charIndex >= initialCode.length) return

    const tick = () => {
      setCode(initialCode.slice(0, charIndex + 1))
      setCharIndex(charIndex + 1)
    }

    const handle = window.setTimeout(tick, LOAD_CHAR_INTERVAL)

    return () => window.clearTimeout(handle)
  }, [initialCode, charIndex])

  return code
}
