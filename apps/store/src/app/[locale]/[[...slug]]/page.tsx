import * as process from 'node:process'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { cache } from 'react'
import { ContactUs } from '@/components/ContactUs/ContactUs'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { PriceCalculatorCmsPage } from '@/features/priceCalculator/PriceCalculatorCmsPage'
import { CustomerFirstScript } from '@/services/CustomerFirst'
import type { PageStory } from '@/services/storyblok/storyblok'
import { MOST_VISITED_PATHS } from '@/services/storyblok/Storyblok.constant'
import {
  getImgSrc,
  isPriceCalculatorPageStory,
  isProductPageStory,
  isProductStory,
  type PageLink,
} from '@/services/storyblok/Storyblok.helpers'
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
import { removeTrailingSlash } from '@/utils/url'
import { ContentCmsPage } from './ContentCmsPage'
import { ProductCmsPage } from './ProductCmsPage'
import { ProductCmsPageV2 } from './ProductCmsPageV2'
import { StoryBreadcrumbs } from './StoryBreadcrumbs'

export type CmsPageRoutingParams = { locale: RoutingLocale; slug?: Array<string> }
type Props = {
  params: CmsPageRoutingParams
}

// NOTE: Since we're using catch-all routing segment, we have to do our own dispatching
// to specific components based on story content type
// Any type-specific data fetching should happen in child components
export default async function CmsPage({ params }: Props) {
  if (!isRoutingLocale(params.locale)) {
    console.log(`Invalid locale: ${params.locale}`)
    throw notFound()
  }
  const story = await fetchStory(params.locale, params.slug?.join('/'))

  const { hideBreadcrumbs, hideChat } = story.content
  let chat: ReactNode = null
  if (!hideChat) {
    chat = Features.enabled('CUSTOM_CHAT') ? <ContactUs /> : <CustomerFirstScript />
  }
  if (isProductStory(story)) {
    return (
      <>
        <ProductCmsPage locale={params.locale} story={story} />
        <StoryBreadcrumbs params={params} currentPageTitle={story.name} />
        {chat}
      </>
    )
  } else if (isProductPageStory(story)) {
    return (
      <>
        <ProductCmsPageV2 locale={params.locale} story={story} />
        <StoryBreadcrumbs params={params} currentPageTitle={story.name} />
      </>
    )
  } else if (isPriceCalculatorPageStory(story)) {
    return (
      <>
        <PriceCalculatorCmsPage locale={params.locale} story={story} />
        <StoryBreadcrumbs params={params} currentPageTitle={story.name} />
      </>
    )
  }

  return (
    <>
      <ContentCmsPage locale={params.locale} story={story} />
      {!hideBreadcrumbs && <StoryBreadcrumbs params={params} currentPageTitle={story.name} />}
      {chat}
      <DefaultDebugDialog />
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isRoutingLocale(params.locale)) {
    throw notFound()
  }
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
    robots: story.content.robots ?? 'noindex',
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
  const shouldPrebuild = (pageLink: PageLink) => {
    if (
      process.env.VERCEL_ENV !== 'production' &&
      pageLink.link.slug === 'se/forsakringar/hemforsakring/hyresratt'
    ) {
      // Temporary workaround: don't let terms-hub error on SE_APARTMENT_RENT break builds in staging
      // Remove when root cause is fixed
      return false
    }
    return MOST_VISITED_PATHS.has(`/${removeTrailingSlash(pageLink.link.slug)}`)
  }
  const result = pageLinks.filter(shouldPrebuild).map((link) => ({
    slug: link.slugParts,
  }))
  return result
}

// Only some routes are statically built, other are resolved dynamically and then cached
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
export const dynamicParams = true
// Make sure we don't accidentally use dynamic rendering
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'force-static'

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
