import type { Metadata } from 'next'
import { removeTrailingSlash } from 'next/dist/shared/lib/router/utils/remove-trailing-slash'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { PageBlock } from '@/blocks/PageBlock'
import type { PageStory } from '@/services/storyblok/storyblok'
import { MOST_VISITED_PATHS } from '@/services/storyblok/Storyblok.constant'
import { getImgSrc, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { getCmsPageLinks, getStoryBySlug } from '@/services/storyblok/storyblok.serverOnly'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import type { IsoLocale, RoutingLocale } from '@/utils/l10n/types'
import { ProductCmsPage } from './ProductCmsPage'
import { StoryBreadcrumbs } from './StoryBreadcrumbs'

export type CmsPageRoutingParams = { locale: RoutingLocale; slug?: Array<string> }
type Props = {
  params: CmsPageRoutingParams
}

export default async function CmsPage(props: Props) {
  // Make this a dynamic route
  const headersList = headers()
  const referer = headersList.get('referer')

  console.log({ referer })

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
      <PageBlock blok={story.content} />
      {!hideBreadcrumbs && <StoryBreadcrumbs params={props.params} currentPageTitle={story.name} />}
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await fetchStory(params.locale, params.slug?.join('/'))
  const pageUrl = [params.locale, ...(params.slug ?? [])].join('/')

  const alternates = {
    canonical: story.content.canonicalUrl || pageUrl,
    languages: {
      [toIsoLocale(params.locale)]: pageUrl,
    } as Record<IsoLocale, string>,
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

export async function generateStaticParams({
  params,
}: {
  params: Pick<CmsPageRoutingParams, 'locale'>
}): Promise<Array<{ slug: Array<string> }>> {
  // TODO: Remove when main CMS route is removed from pages router
  if (process.env.APP_ROUTER_GENERATE_CMS_PAGES !== 'true') {
    return []
  }

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

// DEBUG: Set SWR for 60 seconds
export const dynamic = 'auto'
export const revalidate = 60

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
