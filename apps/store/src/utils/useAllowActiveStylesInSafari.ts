import { useEffect } from 'react'

// Source: https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
export const useAllowActiveStylesInSafari = () => {
  useEffect(() => {
    const handler = () => {}
    document.addEventListener('touchstart', handler, true)
    return () => document.removeEventListener('touchstart', handler, true)
  }, [])
}
