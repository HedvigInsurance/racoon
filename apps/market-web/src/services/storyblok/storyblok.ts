import StoryblokClient from 'storyblok-js-client'
import type { ImageUrl, LinkComponent, PageStoryData, StoryblokLinkItem } from './types'

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

// We use our own domains for assets in staging and prod https://www.storyblok.com/docs/custom-assets-domain
export const getStoryblokImage = (url?: ImageUrl) =>
  getPublicHost()
    ? (url || '').replace(/^(https?:)?\/\/a\.storyblok\.com\//, getPublicHost() + '/')
    : url

export const getStoryblokLinkUrl = (link: LinkComponent) => {
  const cachedLink =
    link.linktype !== 'story' || /^\//.test(link.cached_url)
      ? link.cached_url
      : `/${link.cached_url}`
  const publicHost = getPublicHost()
  return publicHost ? cachedLink.replace('https://www.hedvig.com', publicHost) : cachedLink
}
