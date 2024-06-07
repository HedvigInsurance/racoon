// Use server component by default, but keep client-side rendering for better live edit experience in preview mode
import { StoryblokComponent } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { draftMode } from 'next/headers'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import { type PageStory } from '@/services/storyblok/storyblok'

type Props = {
  story: PageStory
}
export function StoryWithPreviewSupport({ story }: Props) {
  if (draftMode().isEnabled) {
    return <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
  } else {
    return <StoryblokComponent blok={story.content} />
  }
}
