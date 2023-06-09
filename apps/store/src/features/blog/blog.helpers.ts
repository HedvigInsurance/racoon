import { type ISbStoryData } from '@storyblok/react'
import { type BlogArticleCategory } from './blog.types'

export const convertToBlogArticleCategory = (data: ISbStoryData): BlogArticleCategory => {
  return {
    id: data.uuid,
    name: data.name,
    href: data.full_slug,
  }
}
