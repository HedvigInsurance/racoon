import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { StoryblokPageProps } from '@/services/storyblok/storyblok'

type RemoveBoolean<TType> = TType extends boolean ? never : TType
type StoryDataType = RemoveBoolean<StoryblokPageProps['globalStory']>

const removeBooleanType = (data: StoryblokPageProps['globalStory']): StoryDataType =>
  data as StoryDataType

export const Page = ({ story: initialStory, globalStory }: StoryblokPageProps) => {
  const globalStoryWithData = removeBooleanType(globalStory)
  const story = useStoryblokState(initialStory)
  return (
    <>
      {<StoryblokComponent blok={globalStoryWithData.content} />}
      <StoryblokComponent blok={story.content} />
    </>
  )
}
