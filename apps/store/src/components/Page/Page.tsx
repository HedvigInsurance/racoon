import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

export const Page = ({ story: initialStory }: StoryblokPageProps) => {
  const story = useStoryblokState(initialStory)

  return <StoryblokComponent blok={story.content} />
}
