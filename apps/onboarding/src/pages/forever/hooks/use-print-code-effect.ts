import type { Dispatch, SetStateAction } from 'react'

import { useEffect } from 'react'

export const LOAD_CHAR_INTERVAL = 250

type PrintCodeEffectParams = {
  initialCode: unknown
  setCode: Dispatch<SetStateAction<string>>
}

export const usePrintCodeEffect = ({ initialCode, setCode }: PrintCodeEffectParams) => {
  useEffect(() => {
    if (typeof initialCode === 'string') {
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
    }

    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
