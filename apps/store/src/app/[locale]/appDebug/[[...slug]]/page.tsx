import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageBlock } from '@/blocks/PageBlock'
import type { PageStory } from '@/services/storyblok/storyblok'
import { getImgSrc, isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { getStoryBySlug } from '@/services/storyblok/storyblok.serverOnly'
import { isRoutingLocale, toIsoLocale } from '@/utils/l10n/localeUtils'
import type { IsoLocale, RoutingLocale } from '@/utils/l10n/types'
import { ProductCmsPage } from './ProductCmsPage'
import { StoryBreadcrumbs } from './StoryBreadcrumbs'

export type CmsPageRoutingParams = { locale: RoutingLocale; slug?: Array<string> }
type Props = {
  params: CmsPageRoutingParams
}

export default async function CmsPage(props: Props) {
  const story = await fetchStory(props.params)
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
  const story = await fetchStory(params)
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

async function fetchStory(params: CmsPageRoutingParams) {
  const { locale } = params
  const slug = (params.slug ?? []).join('/')
  try {
    return await getStoryBySlug<PageStory>(slug, {
      version: 'published',
      locale,
    })
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
}
