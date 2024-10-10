import { type GetServerSidePropsContext, type GetStaticPropsContext } from 'next'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { fetchBreadcrumbs } from '@/components/PageBreadcrumbs/fetchBreadcrumbs'
import { type BreadcrumbListItem } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { fetchCompanyReviewsMetadata } from '@/features/memberReviews/memberReviews'
import { type RoutingLocale } from '@/utils/l10n/types'
import { initializeApollo } from '../apollo/client'
import { hideChatOnPage } from '../pageChat'
import type { PageStory, ProductStory } from './storyblok'
import { getStoryBySlug } from './storyblok'
import { STORY_PROP_NAME } from './Storyblok.constant'

type Params = {
  context: GetServerSidePropsContext | GetStaticPropsContext
  slug: string
  locale: RoutingLocale
  draftMode?: boolean
}

export const getStoryblokPageProps = async ({
  context,
  slug,
  locale,
  draftMode = false,
}: Params) => {
  const apolloClient = initializeApollo({ locale })

  const version = draftMode ? 'draft' : undefined

  const timerName = `Get Storyblok page props for ${locale}/${slug} ${draftMode ? '(draft)' : ''}`
  console.time(timerName)
  const [layoutWithMenuProps, parentBreadcrumbs, companyReviewsMetadata] = await Promise.all([
    getLayoutWithMenuProps(context, apolloClient),
    fetchBreadcrumbs(slug, { version, locale }),
    fetchCompanyReviewsMetadata(),
  ]).catch((error) => {
    throw new Error(`Failed to fetch data for ${slug}: ${error.message}`, { cause: error })
  })

  let story: PageStory | ProductStory
  try {
    story = await getStoryBySlug<PageStory | ProductStory>(slug, { version, locale })
  } catch {
    throw new Error(`Story with slug ${locale}/${slug} not found`)
  } finally {
    console.timeEnd(timerName)
  }

  let breadcrumbs: Array<BreadcrumbListItem> | null = null
  if (!('hideBreadcrumbs' in story.content && story.content.hideBreadcrumbs)) {
    breadcrumbs = [...parentBreadcrumbs, { label: story.name }]
  }

  return {
    ...layoutWithMenuProps,
    ...hideChatOnPage(story.content.hideChat ?? false),
    [STORY_PROP_NAME]: story,
    breadcrumbs,
    companyReviewsMetadata,
  }
}
