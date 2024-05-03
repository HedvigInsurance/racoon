import 'server-only'
import type { ISbStoryData } from '@storyblok/react'
import { apiPlugin, getStoryblokApi, storyblokInit } from '@storyblok/react/rsc'
import { BLOG_ARTICLE_CONTENT_TYPE } from '@/features/blog/blog.constants'
import type { StoryOptions } from '@/services/storyblok/storyblok'
import { LINKS_EXCLUDE_PATHS } from '@/services/storyblok/Storyblok.constant'
import type { LinkData, PageLink } from '@/services/storyblok/Storyblok.helpers'
import { storyblokComponents } from '@/services/storyblok/storyblokComponents'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

// Overall app router setup for Storyblok based on
// https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-13-in-5-minutes

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: storyblokComponents,
})

export const getStoryBySlug = async <T extends ISbStoryData>(
  slug: string,
  { locale, version = 'published' }: StoryOptions,
): Promise<T> => {
  const storyblokApi = await getStoryblokApiWithCache()
  const fullSlug = slug.length > 0 ? `${locale}/${slug}` : locale
  const { data } = await storyblokApi
    .getStory(fullSlug, {
      version,
      resolve_links: 'url',
      resolve_relations: `reusableBlockReference.reference,${BLOG_ARTICLE_CONTENT_TYPE}.categories,page.abTestOrigin`,
    })
    .catch((err) => {
      console.log(`Failed to get story ${fullSlug}`, err)
      throw err
    })
  return data.story as T
}

export const getParentStories = async (slug: string, { version, locale }: StoryOptions) => {
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
  return await Promise.all(parentSlugs.map((slug) => getStoryBySlug(slug, { locale, version })))
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

const getStoryblokApiWithCache = async (): Promise<ReturnType<typeof getStoryblokApi>> => {
  const cacheVersion = await fetchStoryblokCacheVersion()
  const storyblokApi = getStoryblokApi()
  // fetchStoryblokCacheVersion might be returning from cache, so we want to update current instance
  storyblokApi.setCacheVersion(cacheVersion)
  return storyblokApi
}

const cvCacheTag = 'storyblok.cv'
const fetchStoryblokCacheVersion = async (): Promise<number> => {
  const storyblokApi = getStoryblokApi()
  await storyblokApi.getStory('se', {}, { next: { tags: [cvCacheTag], revalidate: 60 } })
  return storyblokApi.cacheVersion()
}
