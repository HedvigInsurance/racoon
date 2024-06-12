import 'server-only'
import type { ISbStoryData } from '@storyblok/react'
import { apiPlugin, getStoryblokApi, storyblokInit } from '@storyblok/react/rsc'
import { revalidateTag } from 'next/cache'
import { draftMode } from 'next/headers'
import {
  BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
  BLOG_ARTICLE_CONTENT_TYPE,
} from '@/features/blog/blog.constants'
import type { BlogArticleContentType } from '@/features/blog/blog.types'
import { commonStoryblokComponents } from '@/services/storyblok/commonStoryblokComponents'
import { LINKS_EXCLUDE_PATHS } from '@/services/storyblok/Storyblok.constant'
import type { LinkData, PageLink } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

// Overall app router setup for Storyblok based on
// https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-13-in-5-minutes

// Default cache policy assumes that anything we fetch with `cv` is immutable
const STORYBLOK_CACHE_SETTINGS = {
  // Sets cache: 'force-cache' automatically
  next: {
    revalidate: Infinity,
  },
} as const

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: commonStoryblokComponents,
})

export const getStoryBySlug = async <T extends ISbStoryData>(
  slug: string,
  { locale }: RscStoryOptions,
): Promise<T> => {
  const storyblokApi = await getStoryblokApiWithCache()
  const fullSlug = slug.length > 0 ? `${locale}/${slug}` : locale
  const { data } = await storyblokApi
    .getStory(
      fullSlug,
      {
        version: getVersion(),
        resolve_links: 'url',
        resolve_relations: `reusableBlockReference.reference,${BLOG_ARTICLE_CONTENT_TYPE}.categories,page.abTestOrigin`,
      },
      STORYBLOK_CACHE_SETTINGS,
    )
    .catch((err) => {
      console.log(`Failed to get story ${fullSlug}`, err)
      throw err
    })
  return data.story as T
}

type RscStoryOptions = {
  locale: RoutingLocale
}

const getVersion = () => {
  return draftMode().isEnabled ? 'draft' : 'published'
}

export const getParentStories = async (slug: string, { locale }: RscStoryOptions) => {
  const absoluteSlug = slug.startsWith('/') ? slug : `/${slug}`
  const parentSlugs = absoluteSlug
    .split('/')
    .slice(0, -1)
    .map((_, index, array) =>
      array
        .slice(0, index + 1)
        .join('/')
        .replaceAll(/(^\/|\/$)/g, ''),
    )

  // Individual per-story requests probably mean better cache hit ratio and less traffic overall
  // We used to fetch all parents with single requests in pages router instead
  return await Promise.all(parentSlugs.map((slug) => getStoryBySlug(slug, { locale })))
}

export const getCmsPageLinks = async (startsWith?: string) => {
  const storyblokApi = await getStoryblokApiWithCache()
  const {
    data: { links },
  } = (await storyblokApi.get(
    'cdn/links/',
    {
      ...(startsWith && { starts_with: startsWith }),
      version: 'published',
    },
    STORYBLOK_CACHE_SETTINGS,
  )) as unknown as { data: { links: Record<string, LinkData> } }

  const pageLinks: Array<PageLink> = []
  for (const link of Object.values(links)) {
    if (link.is_folder) continue
    const [locale, ...slugParts] = link.slug.split('/')
    if (!isRoutingLocale(locale)) continue
    if (LINKS_EXCLUDE_PATHS.has(slugParts[0])) continue
    pageLinks.push({
      link,
      locale,
      slugParts,
    })
  }
  return pageLinks
}

// See https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation for caching logic
//
// We cannot rely on storyblok-js-client to hold current `cv` in-memory - this works locally, but not on Vercel
// Also, there's no reliable way to update the value from /api/cms/revalidate webhook
// Therefore we manually provide `cv` to ensure every subsequent request uses it.
// Requests with cv=undefined are
// - slower since they hit Storyblok server instead of CDN
// - sometimes result in rate-limit errors when we're rebuilding a lot of pages
// - generally unsafe to cache since current version can change at any time
const getStoryblokApiWithCache = async (): Promise<ReturnType<typeof getStoryblokApi>> => {
  const storyblokApi = getStoryblokApi()
  const cacheVersion = await fetchStoryblokCacheVersion()
  if (storyblokApi.cacheVersion() != cacheVersion) {
    console.debug('Got new storyblok cache version', cacheVersion)
    storyblokApi.setCacheVersion(cacheVersion)
  }
  return storyblokApi
}

const cvCacheTag = 'storyblok.cv'
const fetchStoryblokCacheVersion = async (): Promise<number> => {
  const storyblokApi = getStoryblokApi()
  const {
    data: {
      space: { version },
    },
  } = await storyblokApi.get(
    'cdn/spaces/me',
    // GOTCHA: Make sure we don't pass previous cv, we'll never get value one otherwise
    { cv: -1 },
    // Using nextjs fetch cache as a way to pass `cv` between requests.
    // Revalidation is normally handled through webhook (/api/cms/revalidate), time here serves as fallback to ensure
    // we never end up with stale value for too long if webhook fails
    { next: { revalidate: 60, tags: [cvCacheTag] } },
  )
  return version as number
}

export const revalidateCacheVersion = () => revalidateTag(cvCacheTag)

export const getBlogCategories = async (locale: RoutingLocale) => {
  const storyblokApi = await getStoryblokApiWithCache()
  const response = await storyblokApi.getStories(
    {
      content_type: BLOG_ARTICLE_CATEGORY_CONTENT_TYPE,
      starts_with: `${locale}/`,
      version: getVersion(),
    },
    STORYBLOK_CACHE_SETTINGS,
  )
  return response.data.stories.map((item) => ({
    id: item.uuid,
    name: item.name,
    href: item.full_slug,
  }))
}

export const getBlogArticles = async (locale: RoutingLocale) => {
  const storyblokApi = await getStoryblokApiWithCache()
  const response = await storyblokApi.getStories(
    {
      content_type: BLOG_ARTICLE_CONTENT_TYPE,
      starts_with: `${locale}/`,
      resolve_relations: `${BLOG_ARTICLE_CONTENT_TYPE}.categories`,
      per_page: 100,
      version: getVersion(),
    },
    STORYBLOK_CACHE_SETTINGS,
  )

  if (response.total > response.perPage) {
    // TODO: Implement pagination once we have more than 100 articles
    throw new Error('Too many blog articles to fetch in one request')
  }

  return response.data.stories as Array<BlogArticleContentType>
}
