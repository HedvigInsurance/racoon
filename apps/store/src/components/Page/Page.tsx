import { StoryblokComponent, StoryData, useStoryblokState } from '@storyblok/react'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

const isStoryData = (value: unknown): value is StoryData => {
  return (value as any).content !== undefined
}

export const Page = ({ story: initialStory, globalStory }: StoryblokPageProps) => {
  const story = useStoryblokState(initialStory)
  return (
    <>
      {isStoryData(globalStory) && <StoryblokComponent blok={globalStory.content} />}
      <StoryblokComponent blok={story.content} />
    </>
  )
}
