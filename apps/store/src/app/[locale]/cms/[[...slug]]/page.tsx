import { StoryblokStory } from '@storyblok/react/rsc'
import type { Metadata } from 'next'
import { removeTrailingSlash } from 'next/dist/shared/lib/router/utils/remove-trailing-slash'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { storyblokBridgeOptions } from '@/appComponents/storyblokBridgeOptions'
import type { PageStory } from '@/services/storyblok/storyblok'
import { MOST_VISITED_PATHS } from '@/services/storyblok/Storyblok.constant'
import { getImgSrc, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { getCmsPageLinks, getStoryBySlug } from '@/services/storyblok/storyblok.rsc'
import { locales } from '@/utils/l10n/locales'
import {
  getHrefLang,
  getLocaleOrFallback,
  isRoutingLocale,
  toIsoLocale,
} from '@/utils/l10n/localeUtils'
import type { IsoLocale, RoutingLocale } from '@/utils/l10n/types'
import { ProductCmsPage } from './ProductCmsPage'
import { StoryBreadcrumbs } from './StoryBreadcrumbs'

export type CmsPageRoutingParams = { locale: RoutingLocale; slug?: Array<string> }
type Props = {
  params: CmsPageRoutingParams
}

export default async function CmsPage(props: Props) {
  const story = await fetchStory(props.params.locale, props.params.slug?.join('/'))
  // Patching incorrect data from Storyblok for /se-en/
  let { hideBreadcrumbs } = story.content
  if ((props.params.slug?.length ?? 0) < 1) {
    hideBreadcrumbs = true
  }
  if (isProductStory(story)) {
    return (
      <>
        <ProductCmsPage locale={props.params.locale} story={story} />
        <StoryBreadcrumbs params={props.params} currentPageTitle={story.name} />
      </>
    )
  }
  return (
    <>
      <StoryblokStory story={story} bridgeOptions={storyblokBridgeOptions} />
      {!hideBreadcrumbs && <StoryBreadcrumbs params={props.params} currentPageTitle={story.name} />}
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await fetchStory(params.locale, params.slug?.join('/'))
  const pageUrl = [params.locale, ...(params.slug ?? [])].join('/')

  const swedishAlternate = story.alternates.find(
    (link) => getHrefLang(link.full_slug) === getLocaleOrFallback(locales['sv-SE'].locale).locale,
  )

  // There is no `swedishAlternate` when we are on a Swedish page
  const defaultAlternateSlug = swedishAlternate ? swedishAlternate.full_slug : pageUrl

  const alternates = {
    canonical: story.content.canonicalUrl || pageUrl,
    languages: {} as Record<IsoLocale | 'x-default', string>,
  }

  // Only add self referring alternates when alternates are available
  if (story.alternates.length > 0) {
    alternates.languages[toIsoLocale(params.locale)] = pageUrl
    alternates.languages['x-default'] = defaultAlternateSlug
  }

  for (const alt of story.alternates) {
    const routingLocale = alt.full_slug.split('/')[0]
    if (!isRoutingLocale(routingLocale)) continue
    alternates.languages[toIsoLocale(routingLocale)] = alt.full_slug
  }

  const description = story.content.seoMetaDescription
  const title = story.content.seoTitle

  const result: Metadata = {
    alternates,
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
    // Prevent indexing until we're ready to replace pages/[[...slug]]
    robots: 'noindex, nofollow',
    // robots: story.content.robots,
    title,
  }
  return result
}

// TODO: Restore export generateStaticParams when CMS page migration to app router is done. Right now pages/[locale]/[[...slug]]
//  shadows non-listed pages when generateStaticParams is provided
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generateStaticParams({
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
