import { useEffect, useState } from 'react'

export const useIsEmbedded = () => {
  const [isEmbedded, setIsEmbedded] = useState(false)

  useEffect(() => {
    if (isWebview(window.navigator.userAgent) || inIframe()) {
      setIsEmbedded(true)
    }
  }, [])

  return isEmbedded
}

// Source: https://github.com/dvlden/is-webview/blob/main/src/index.ts
const isWebview = (userAgent: string) => {
  return /webview|wv|ip((?!.*Safari)|(?=.*like Safari))/i.test(userAgent)
}

// Source: https://stackoverflow.com/a/326076/2310187
const inIframe = () => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}
