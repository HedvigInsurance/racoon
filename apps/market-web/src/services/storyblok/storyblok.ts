import StoryblokClient from 'storyblok-js-client'
import type { ImageUrl, PageStoryData, StoryblokLinkItem } from './types'

interface FetchOptions {
  preview?: boolean
}

const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_API_KEY as string,
  cache: { clear: 'auto', type: 'memory' },
})

export const getAllLinks = async ({ preview = false }: FetchOptions = {}) => {
  return (await Storyblok.getAll('cdn/links', {
    version: preview ? 'draft' : 'published',
  })) as Array<StoryblokLinkItem>
}

export const getStoryBySlug = async (slug: string, { preview = false }: FetchOptions = {}) => {
  const response = await Storyblok.getStory(slug, {
    version: preview ? 'draft' : 'published',
    cv: preview ? Date.now() : undefined,
  })
  return response.data.story as PageStoryData
}

export const getPublicHost = (): string | undefined => {
  if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env.PUBLIC_HOST) {
    return process.env.PUBLIC_HOST
  }

  if (typeof window !== 'undefined') {
    return (window as any).PUBLIC_HOST
  }

  return ''
}

export const getStoryblokImage = (url?: ImageUrl) =>
  getPublicHost()
    ? (url || '').replace(/^(https?:)?\/\/a\.storyblok\.com\//, getPublicHost() + '/')
    : url
