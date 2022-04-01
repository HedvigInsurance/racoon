import { useEffect, useState } from 'react'

export const LOAD_CHAR_INTERVAL = 150

type PrintCodeEffectParams = {
  initialCode: string
}

export const usePrintCodeEffect = ({ initialCode }: PrintCodeEffectParams) => {
  const [code, setCode] = useState('')

  useEffect(() => {
    let charIndex = 0
    setCode('')

    const handle = window.setInterval(() => {
      if (charIndex < initialCode.length) {
        setCode((codePiece) => codePiece + initialCode[charIndex])
        charIndex++
      } else {
        window.clearInterval(handle)
      }
    }, LOAD_CHAR_INTERVAL)

    return () => {
      window.clearInterval(handle)
    }

    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return code
}
