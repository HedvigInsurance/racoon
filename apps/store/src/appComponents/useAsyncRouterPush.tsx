import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useTransition } from 'react'

// Hacky solution to wait for the router to finish the transition as `router` from `next/navigation`
// package doesn't have a promise based API to wait for the transition to finish. They don't expose
// events either. They claim that all navigations in app router are built on React Transitions so
// the way forward for knowing wherebouts of a navigation is to use `useTransition` hook from React.
// More info https://github.com/vercel/next.js/discussions/41934#discussioncomment-8996669
export function useAsyncRouterPush() {
  const router = useRouter()
  // We assume no other transition will happening at the same time
  const [isPending] = useTransition()
  const promiseResolveFnRef = useRef<((value?: unknown) => void) | null>(null)

  useEffect(() => {
    if (!isPending) {
      promiseResolveFnRef.current?.()
    }
  }, [isPending])

  const push = useCallback(
    (url: string) => {
      return new Promise((resolve) => {
        // Ideally we could attach the resolve function to a router event but they're not exposed
        // by next/navigation router. So we're using a ref to store the resolve function and calling
        // it when the transition is finished based on the `isPending` value.
        promiseResolveFnRef.current = resolve
        router.push(url)
      })
    },
    [router],
  )

  return push
}
