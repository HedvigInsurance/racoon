import 'server-only'
import type { ISbStoryData } from '@storyblok/react'
import { apiPlugin, getStoryblokApi, storyblokInit } from '@storyblok/react/rsc'
import { BLOG_ARTICLE_CONTENT_TYPE } from '@/features/blog/blog.constants'
import type { StoryblokVersion, StoryOptions } from '@/services/storyblok/storyblok'
import { storyblokComponents } from '@/services/storyblok/storyblokComponents'
import type { Language } from '@/utils/l10n/types'

// Overall app router setup for Storyblok based on
// https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-13-in-5-minutes

const cvCacheTag = 'storyblok.cv'

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
})

export const fetchStoryblokCacheVersion = async ({
  cache = 'force-cache',
}: {
  cache: RequestCache
}): Promise<number> => {
  const storyblokApi = getStoryblokApi()
  await storyblokApi.getStory('/se', {}, { cache, next: { tags: [cvCacheTag] } })
  return storyblokApi.cacheVersion()
}

const primeCache = () => fetchStoryblokCacheVersion({ cache: 'force-cache' })

export type StoryblokFetchParams = {
  version?: StoryblokVersion
  language?: Language
  resolve_relations?: string
}

export const getStoryBySlug = async <T extends ISbStoryData>(
  slug: string,
  { version, locale }: StoryOptions,
): Promise<T> => {
  const storyblokApi = getStoryblokApi()
  await primeCache()
  const { data } = await storyblokApi.getStory(`${locale}/${slug}`, {
    version,
    resolve_links: 'url',
    resolve_relations: `reusableBlockReference.reference,${BLOG_ARTICLE_CONTENT_TYPE}.categories,page.abTestOrigin`,
  })
  return data.story as T
}

export const getParentStories = async (slug: string, { version, locale }: StoryOptions) => {
  const absoluteSlug = slug.startsWith('/') ? slug : `/${slug}`
  const parentSlugs = absoluteSlug
    .split('/')
    .slice(0, -1)
    .map((_, index, array) => array.slice(0, index + 1).join('/'))

  // Individual per-story requests probably mean better cache hit ratio and less traffic overall
  // We used to fetch all parents with single requests in pages router instead
  return await Promise.all(parentSlugs.map((slug) => getStoryBySlug(slug, { version, locale })))
}
