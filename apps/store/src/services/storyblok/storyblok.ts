import { apiPlugin, getStoryblokApi, SbBlokData, storyblokInit, StoryData } from '@storyblok/react'
import { HeadingBlock } from '@/blocks/HeadingBlock'
import { PageBlock } from '@/blocks/PageBlock'

export type SbBaseBlockProps<T> = {
  blok: SbBlokData & T
}

export type StoryblokPageProps = {
  story: StoryData
}

export type StoryblokQueryParams = {
  slug: string[]
}

export const initStoryblok = () => {
  const components = {
    heading: HeadingBlock,
    page: PageBlock,
  }

  storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components,
  })
}

export const getStoryBySlug = async (slug: string, preview = false) => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
    version: preview ? 'draft' : 'published',
  })
  return data.story
}

export const getAllLinks = async () => {
  const storyblokApi = getStoryblokApi()
  const { data } = await storyblokApi.get('cdn/links/')
  return data.links
}
