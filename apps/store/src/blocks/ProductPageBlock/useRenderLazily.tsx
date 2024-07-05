import { startTransition, useCallback, useState } from 'react'
import { useIdleCallback } from '@/utils/useIdleCallback'

export const useRenderLazily = () => {
  const [shouldRender, setShouldRender] = useState(false)
  // Callback need to be stable to avoid rerender loop
  const makeVisible = useCallback(() => startTransition(() => setShouldRender(true)), [])
  useIdleCallback(makeVisible)
  return shouldRender
}
