'use client'
import { type SbBlokData, StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { useRenderLazily } from '@/blocks/ProductPageBlock/useRenderLazily'
import type { ProductStory } from '@/services/storyblok/storyblok'

// This is a prototype for measuring rendering speed change
// from moving above-the-fold elements to server components
//
// FIXME: what separates this POC from being production-ready
// 1 - sticky header with section nav
// 2 - vanilla styles for PurchaseFormWrapper
export function ProductPageBlockNew({ story: initialStory }: { story: ProductStory }) {
  const story = useStoryblokState(initialStory, storyblokBridgeOptions)
  if (story == null) return null
  return (
    <>
      <ProductPageOverview blocks={story.content.overview} />

      <ProductPageCoverage blocks={story.content.coverage} />

      <ProductPageContent blocks={story.content.body} />
    </>
  )
}

function ProductPageOverview({ blocks }: { blocks: Array<SbBlokData> }) {
  return (
    <section id="overview">
      {blocks.map((nestedBlock) => (
        <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />
      ))}
    </section>
  )
}

export function ProductPageContent({ blocks }: { blocks: Array<SbBlokData> }) {
  const shouldRenderContent = useRenderLazily()
  return (
    shouldRenderContent &&
    blocks.map((nestedBlock) => <StoryblokComponent blok={nestedBlock} key={nestedBlock._uid} />)
  )
}

export function ProductPageCoverage({ blocks }: { blocks: Array<SbBlokData> }) {
  const shouldRenderContent = useRenderLazily()
  return (
    <section id="coverage">
      {shouldRenderContent &&
        blocks.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
        ))}
    </section>
  )
}
