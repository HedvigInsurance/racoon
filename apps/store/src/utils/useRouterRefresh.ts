import { useRouter } from 'next/router'
import { useCallback } from 'react'

export default function useRouterRefresh() {
  const { asPath, replace } = useRouter()
  return useCallback(() => replace(asPath, undefined, { scroll: false }), [replace, asPath])
}
