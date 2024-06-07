'use client'
import type { SbBlokData} from '@storyblok/react';
import { StoryblokComponent } from '@storyblok/react'
import { startTransition, useCallback, useState } from 'react'
import { useIdleCallback } from '@/utils/useIdleCallback'

// Optimization:
// Perils list could be hundreds of DOM elements (400+ for Apartment rent) and if we lazy-render it, page load time of product pages improves
export const CoverageSection = (props: { blocks: Array<SbBlokData> }) => {
  const shouldRenderContent = useRenderLazily()
  return (
    <section id="coverage">
      {shouldRenderContent &&
        props.blocks.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
    </section>
  )
}

// Optimization
// Lazy rendering, same as CoverageSection above
export const ContentSection = (props: { blocks: Array<SbBlokData> }) => {
  const shouldRenderContent = useRenderLazily()
  return (
    <>
      {shouldRenderContent &&
        props.blocks.map((nestedBlock) => (
          <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
        ))}
    </>
  )
}

const useRenderLazily = () => {
  const [shouldRender, setShouldRender] = useState(false)
  // Callback need to be stable to avoid rerender loop
  const makeVisible = useCallback(() => startTransition(() => setShouldRender(true)), [])
  useIdleCallback(makeVisible)
  return shouldRender
}
