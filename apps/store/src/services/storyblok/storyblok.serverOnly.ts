import 'server-only'
import type { ISbStoryData } from '@storyblok/react'
import { apiPlugin, getStoryblokApi, storyblokInit } from '@storyblok/react/rsc'
import { draftMode } from 'next/headers'
import { BLOG_ARTICLE_CONTENT_TYPE } from '@/features/blog/blog.constants'
import { LINKS_EXCLUDE_PATHS } from '@/services/storyblok/Storyblok.constant'
import type { LinkData, PageLink } from '@/services/storyblok/Storyblok.helpers'
import { storyblokComponents } from '@/services/storyblok/storyblokComponents'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import type { RoutingLocale } from '@/utils/l10n/types'

// Overall app router setup for Storyblok based on
// https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-13-in-5-minutes

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
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
      {
        // Use 'no-cache' for debugging caching issue
        cache: 'force-cache',
      },
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
  } = (await storyblokApi.get('cdn/links/', {
    ...(startsWith && { starts_with: startsWith }),
    version: 'published',
  })) as unknown as { data: { links: Record<string, LinkData> } }

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
// We can rely on storyblok-js-client to hold current `cv` in-memory,
// but on first start we want to fetch and provide current value
// to ensure every subsequent request uses `cv` and is therefore safe to cache without expiration.
//
// Requests with cv=undefined are
// - slower since they hit Storyblok server instead of CDN
// - sometimes result in rate-limit errors when we're rebuilding a lot of pages
// - generally unsafe to cache since current version can change at any time
const getStoryblokApiWithCache = async (): Promise<ReturnType<typeof getStoryblokApi>> => {
  const storyblokApi = getStoryblokApi()
  if (!storyblokApi.cacheVersion()) {
    storyblokApi.setCacheVersion(await fetchStoryblokCacheVersion())
  }
  return storyblokApi
}

// Potential optimization: cache: 'force-cache' and rely on webhooks to invalidate
const fetchStoryblokCacheVersion = async (): Promise<number> => {
  const storyblokApi = getStoryblokApi()
  const {
    data: {
      space: { version },
    },
  } = await storyblokApi.get('cdn/spaces/me', {}, { cache: 'no-cache' })
  return version as number
}
