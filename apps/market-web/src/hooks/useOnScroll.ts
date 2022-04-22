import { useEffect } from 'react'

export const useOnScroll = (handleScroll: () => void) => {
  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])
}
