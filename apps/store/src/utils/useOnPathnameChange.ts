import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const useOnPathnameChange = (callback: () => void) => {
  const pathname = usePathname()
  useEffect(() => {
    callback()
  }, [pathname])
}
