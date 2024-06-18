'use client'

import { storyblokEditable } from '@storyblok/react'
import { yStack } from 'ui'
import { StoryCarousel } from '@/components/StoryCarousel/StoryCarousel'
import { type StoryblokAsset, type SbBaseBlockProps } from '@/services/storyblok/storyblok'

type StoryCarouselProps = SbBaseBlockProps<{
  images: Array<StoryblokAsset>
  duration?: number
}>

export function StoryCarouselBlock({ blok }: StoryCarouselProps) {
  const images = blok.images.map((image) => ({
    id: image.filename,
    src: image.filename,
    alt: image.alt,
  }))
  // Gotcha: even though defined as a number in storyblock, it get delivered as a string
  const duration = Number(blok.duration)

  if (images.length === 0) {
    console.log('[StoryCarouselBlock] No images found in block. Skipping rendering.')
    return null
  }

  return (
    <div className={yStack({ alignItems: 'center', px: 'sm' })}>
      <StoryCarousel images={images} duration={duration} {...storyblokEditable(blok)} />
    </div>
  )
}
