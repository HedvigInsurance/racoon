import type { PageStoryData, StoryblokLinkItem } from "./types"

import StoryblokClient, { StoryParams } from 'storyblok-js-client'

interface FetchOptions {
  preview?: boolean;
}

const Storyblok = new StoryblokClient({
    accessToken: process.env.STORYBLOK_API_TOKEN as string,
    cache: { clear: 'auto', type: 'memory' }
})

export const getAllLinks = async ({ preview = false }: FetchOptions = {}) => {
  return await Storyblok.getAll('cdn/links', {
    version: preview ? 'draft' : 'published',
  }) as Array<StoryblokLinkItem>
}

export const getStoryBySlug = async (slug: string, { preview = false }: FetchOptions = {}) => {
  const response = await Storyblok.getStory(slug, {
    version: preview ? 'draft' : 'published',
    cv: preview ? Date.now() : undefined,
  })
  return response.data.story as PageStoryData
}
