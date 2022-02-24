import { useCallback } from 'react'
import { useRouter } from 'next/router'

export default function useRouterRefresh() {
  const { asPath, replace } = useRouter()
  return useCallback(() => replace(asPath, undefined, { scroll: false }), [replace, asPath])
}
