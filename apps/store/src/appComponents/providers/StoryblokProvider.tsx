'use client'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import type { PropsWithChildren } from 'react'
import { commonStoryblokComponents } from '@/services/storyblok/commonStoryblokComponents'

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    ...commonStoryblokComponents,
  },
})

// The main purpose of this component is to call storyblokInit client-side
// We may want to set current list of blocks in the future:
// https://github.com/storyblok/storyblok-react?tab=readme-ov-file#3-adding-components-per-page
export function StoryblokProvider({ children }: PropsWithChildren) {
  return children
}
