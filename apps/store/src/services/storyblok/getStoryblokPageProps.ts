import { type GetServerSidePropsContext, type GetStaticPropsContext } from 'next'
import { fetchBreadcrumbs } from '@/components/LayoutWithMenu/fetchBreadcrumbs'
import { getLayoutWithMenuProps } from '@/components/LayoutWithMenu/getLayoutWithMenuProps'
import { fetchCompanyReviewsData } from '@/features/memberReviews/memberReviews'
import { fetchTrustpilotData } from '@/features/memberReviews/trustpilot'
import { type RoutingLocale } from '@/utils/l10n/types'
import { initializeApollo } from '../apollo/client'
import { hideChatOnPage } from '../CustomerFirst'
import { PageStory, ProductStory, getStoryBySlug } from './storyblok'
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
  const [layoutWithMenuProps, breadcrumbs, trustpilotData, companyReviewsData] = await Promise.all([
    getLayoutWithMenuProps(context, apolloClient),
    fetchBreadcrumbs(slug, { version, locale }),
    fetchTrustpilotData(locale),
    fetchCompanyReviewsData(),
  ]).catch((error) => {
    throw new Error(`Failed to fetch data for ${slug}: ${error.message}`, { cause: error })
  })

  let story: PageStory | ProductStory
  try {
    story = await getStoryBySlug<PageStory | ProductStory>(slug, { version, locale })
  } catch (error) {
    throw new Error(`Story with slug ${locale}/${slug} not found`)
  } finally {
    console.timeEnd(timerName)
  }

  return {
    ...layoutWithMenuProps,
    ...hideChatOnPage(story.content.hideChat ?? false),
    [STORY_PROP_NAME]: story,
    breadcrumbs,
    trustpilotData,
    companyReviewsData,
  }
}
