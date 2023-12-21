import { registerStoryblokBridge } from '@storyblok/js'
import { TUseStoryblokState } from '@storyblok/react'
import { useEffect, useRef, useState } from 'react'

// Non-buggy version of useStoryblokState which was broken recently
// https://github.com/storyblok/storyblok-react/issues/112#issuecomment-1864426869
export const useEditableStory: TUseStoryblokState = (initialStory = null) => {
  const [story, setStory] = useState(initialStory)
  const isBridgeEnabled = typeof (window as any)?.storyblokRegisterEvent !== 'undefined'
  const storyId = (initialStory as any).internalId || story?.id
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!isBridgeEnabled || !initialStory) return
    mountedRef.current = true
    setStory(initialStory)
    registerStoryblokBridge(storyId, (newStory) => {
      if (!mountedRef.current) return
      setStory(newStory)
    })
    // TODO: Unsubscribe properly when storyblok/react supports it
    // https://github.com/storyblok/storyblok-react/issues/112
    return () => {
      mountedRef.current = false
    }
    // initialStory is unstable and cannot be used as dependency
    // eslint-disable-next-line
  }, [isBridgeEnabled, storyId])
  return story
}
