import { ISbStoryData, SbBlokData } from '@storyblok/react'

export const isBlogStory = (story: ISbStoryData): boolean => {
  const body = story.content.body as Array<SbBlokData> | undefined
  return body?.find((item) => item.component === 'blogArticleList') !== undefined
}
