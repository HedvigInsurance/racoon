import { ISbStoryData, SbBlokData } from '@storyblok/react/rsc'
import { notFound } from 'next/navigation'
import { PageBlock } from '@/blocks/PageBlock'
import { isProductStory } from '@/services/storyblok/Storyblok.helpers'
import { getStoryBySlug } from '@/services/storyblok/storyblok.serverOnly'
import { RoutingLocale } from '@/utils/l10n/types'
import { ProductCmsPage } from './ProductCmsPage'

type Props = {
  params: { locale: RoutingLocale; slug?: Array<string> }
}

type PageStory = ISbStoryData<{ body: Array<SbBlokData> }>

export default async function CmsPage(props: Props) {
  const { locale } = props.params
  const slug = (props.params.slug ?? []).join('/')

  let story: PageStory
  try {
    story = await getStoryBySlug<PageStory>(slug, {
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
  if (isProductStory(story)) {
    return <ProductCmsPage locale={locale} story={story} />
  }
  return <PageBlock blok={story.content} />
}

// TODO: Add story SEO properties here (see HeadSeoInfo in pages router)
export const metadata = {
  // Prevent indexing until we're ready to replace pages/[[...slug]]
  robots: 'noindex, nofollow',
}
