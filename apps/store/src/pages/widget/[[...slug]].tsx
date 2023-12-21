import { StoryblokComponent } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HedvigLogo } from 'ui'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { HeaderFrame, LogoArea } from '@/features/widget/Header'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import { hideChatOnPage } from '@/services/CustomerFirst'
import {
  getStoryBySlug,
  type StoryblokPageProps,
  type StoryblokQueryParams,
  type PageStory,
  getRevalidate,
  getPageLinks,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { useEditableStory } from '@/services/storyblok/useEditableStory'
import { fetchTrustpilotData, useHydrateTrustpilotData } from '@/services/trustpilot/trustpilot'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type PageProps = Pick<StoryblokPageProps, 'story' | 'trustpilot'>

const NextPage: NextPageWithLayout<PageProps> = (props) => {
  useHydrateTrustpilotData(props.trustpilot)
  const story = useEditableStory(props.story)

  if (!story) return null

  return (
    <>
      <HeadSeoInfo
        // Gotcha: Sometimes Storyblok returns "" for PageStory pages that doesn't get 'abTestOrigin' configured
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        story={story.content.abTestOrigin || story}
        robots="noindex"
      />
      <HeaderFrame>
        <LogoArea>
          <HedvigLogo />
        </LogoArea>
      </HeaderFrame>
      <StoryblokComponent blok={story.content} />
      <DefaultDebugDialog />
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  if (!isRoutingLocale(context.locale)) throw new Error(`Invalid locale: ${context.locale}`)
  if (!context.params) throw new Error('Missing params')

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/${context.params.slug.join('/')}`
  console.info(`Widget | Fetching story for slug: ${slug}`)
  let story: PageStory
  try {
    story = await getStoryBySlug<PageStory>(slug, {
      version: context.draftMode ? 'draft' : undefined,
      locale: context.locale,
    })
  } catch (error) {
    console.warn(`Widget | Failed to fetch story for slug: ${slug}`)
    console.warn(error)
    return { notFound: true }
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
      ...hideChatOnPage(story.content.hideChat ?? false),
      [STORY_PROP_NAME]: story,
      trustpilot: await fetchTrustpilotData(),
    },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    console.info('Skipping static generation for widget landing pages...')
    return { paths: [], fallback: 'blocking' }
  }

  // Call in sequence to avoid hitting Storyblok rate limit
  const nestedPageLinks: Array<Array<{ slugParts: Array<string>; locale: string }>> = []
  for (const locale of context.locales ?? []) {
    const pageLinks = await getPageLinks({
      startsWith: `${locale}/${STORYBLOK_WIDGET_FOLDER_SLUG}`,
    })
    nestedPageLinks.push(pageLinks)
  }

  const paths = nestedPageLinks
    .flat()
    .filter((item) => !item.slugParts.includes('flows'))
    .map((item) => {
      if (item.slugParts[0] !== STORYBLOK_WIDGET_FOLDER_SLUG) {
        throw new Error(`Widget | Invalid slug: ${item.slugParts.join('/')}`)
      }

      // Remove the first part of the slug, which is the page folder name
      return {
        params: { slug: item.slugParts.slice(1) },
        locale: item.locale,
      }
    })

  console.info(`Widget | Generating ${paths.length} paths for widget landing pages`)

  return {
    paths,
    fallback: 'blocking',
  }
}

export default NextPage
