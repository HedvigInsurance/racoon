import { ISbStoryData, SbBlokData } from '@storyblok/react'

export const hasBlogArticleList = (story: ISbStoryData): boolean => {
  const body = story.content.body as Array<SbBlokData> | undefined
  return body?.some((item) => item.component === 'blogArticleList') ?? false
}
