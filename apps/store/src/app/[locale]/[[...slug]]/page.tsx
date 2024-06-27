import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { cache } from 'react'
import { ContactUs } from '@/components/ContactUs/ContactUs'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { CustomerFirstScript } from '@/services/CustomerFirst'
import type { PageStory } from '@/services/storyblok/storyblok'
import { MOST_VISITED_PATHS } from '@/services/storyblok/Storyblok.constant'
import { getImgSrc, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { getCmsPageLinks, getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { Features } from '@/utils/Features'
import { locales } from '@/utils/l10n/locales'
import {
  getHrefLang,
  getLocaleOrFallback,
  isRoutingLocale,
  toIsoLocale,
} from '@/utils/l10n/localeUtils'
import type { IsoLocale, RoutingLocale } from '@/utils/l10n/types'
import { removeTrailingSlash } from '@/utils/PageLink'
import { ContentCmsPage } from './ContentCmsPage'
import { ProductCmsPage } from './ProductCmsPage'
import { StoryBreadcrumbs } from './StoryBreadcrumbs'

export type CmsPageRoutingParams = { locale: RoutingLocale; slug?: Array<string> }
type Props = {
  params: CmsPageRoutingParams
}

export default async function CmsPage(props: Props) {
  const story = await fetchStory(props.params.locale, props.params.slug?.join('/'))

  const { hideBreadcrumbs, hideChat } = story.content
  let chat: ReactNode = null
  if (!hideChat) {
    chat = Features.enabled('CUSTOM_CHAT') ? <ContactUs /> : <CustomerFirstScript />
  }
  if (isProductStory(story)) {
    return (
      <>
        <ProductCmsPage locale={props.params.locale} story={story} />
        <StoryBreadcrumbs params={props.params} currentPageTitle={story.name} />
        {chat}
      </>
    )
  }
  return (
    <>
      <ContentCmsPage locale={props.params.locale} story={story} />
      {!hideBreadcrumbs && <StoryBreadcrumbs params={props.params} currentPageTitle={story.name} />}
      {chat}
      <DefaultDebugDialog />
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await fetchStory(params.locale, params.slug?.join('/'))
  const pageUrl = normalizePageUrl([params.locale, ...(params.slug ?? [])].join('/'))

  const description = story.content.seoMetaDescription
  const title = story.content.seoTitle

  const result: Metadata = {
    alternates: getAlternates(story, pageUrl, params.locale),
    description,
    openGraph: {
      type: 'website',
      url: pageUrl,
      description,
      images: story.content.seoMetaOgImage
        ? {
            url: getImgSrc(story.content.seoMetaOgImage.filename),
            alt: story.content.seoMetaOgImage.alt,
          }
        : undefined,
    },
    robots: story.content.robots,
    title,
  }
  return result
}

// 1. Always provide canonical
// 2. Only provide language alternates if there are multiple languages
// 3. When available refer to Swedish alternate as default
const getAlternates = (story: PageStory, pageUrl: string, locale: RoutingLocale) => {
  const alternates = {
    canonical: normalizePageUrl(story.content.canonicalUrl || pageUrl),
    languages: {} as Record<IsoLocale | 'x-default', string>,
  }

  if (story.alternates.length > 0) {
    const swedishAlternate = story.alternates.find(
      (link) => getHrefLang(link.full_slug) === getLocaleOrFallback(locales['sv-SE'].locale).locale,
    )
    // There is no `swedishAlternate` when we are on a Swedish page
    const defaultAlternateSlug = swedishAlternate
      ? normalizePageUrl(swedishAlternate.full_slug)
      : pageUrl

    alternates.languages[toIsoLocale(locale)] = pageUrl
    alternates.languages['x-default'] = defaultAlternateSlug
    for (const alt of story.alternates) {
      const routingLocale = alt.full_slug.split('/')[0]
      if (!isRoutingLocale(routingLocale)) continue
      alternates.languages[toIsoLocale(routingLocale)] = normalizePageUrl(alt.full_slug)
    }
  }

  return alternates
}

const normalizePageUrl = (url: string) =>
  removeTrailingSlash(url)
    // Apply home page rewrite to /se
    // Special case - this is the only path where we keep trailing slash, NextJs will crash otherwise
    .replace(/^se$/, '/')

export async function generateStaticParams({
  params,
}: {
  params: Pick<CmsPageRoutingParams, 'locale'>
}): Promise<Array<{ slug: Array<string> }>> {
  const pageLinks = await getCmsPageLinks(`${params.locale}/`)
  const mostVisitedLinks = pageLinks.filter((item) =>
    MOST_VISITED_PATHS.has(`/${removeTrailingSlash(item.link.slug)}`),
  )
  const result = mostVisitedLinks.map((link) => ({
    slug: link.slugParts,
  }))
  return result
}

// Only some routes are statically built, other are resolved dynamically and then cached
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true
// Make sure we don't accidentally use dynamic rendering
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'error'

// Cache speeds up development mode by deduplicating requests between metadata and main renderer
const fetchStory = cache(async (locale: RoutingLocale, slug = '') => {
  try {
    return await getStoryBySlug<PageStory>(slug, { locale })
  } catch (err: unknown) {
    if (err != null && typeof err === 'object') {
      const { status } = err as Record<string, any>
      if (status === 404) {
        console.log(`Did not find a story locale=${locale}, slug=${slug}`)
        throw notFound()
      }
    }
    console.error('Failed to get a story', err)
    throw err
  }
})
