import { StoryblokComponent, StoryData, useStoryblokState } from '@storyblok/react'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

function isStoryData(global: StoryData | boolean): global is StoryData {
  return (global as StoryData).content !== undefined
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
