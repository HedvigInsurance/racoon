import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { type GetStaticPaths, type GetStaticProps, type NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HedvigLogo } from 'ui'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { HeaderFrame } from '@/features/widget/Header'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import {
  getStoryBySlug,
  type StoryblokPageProps,
  type StoryblokQueryParams,
  getFilteredPageLinks,
  type PageStory,
  getRevalidate,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type PageProps = Pick<StoryblokPageProps, 'story' | 'hideChat'>

const NextPage: NextPageWithLayout<PageProps> = (props) => {
  const story = useStoryblokState(props.story)

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
        <HedvigLogo />
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
  let story: PageStory
  try {
    story = await getStoryBySlug<PageStory>(slug, {
      version: context.draftMode ? 'draft' : undefined,
      locale: context.locale,
    })
  } catch (error) {
    console.error(`Failed to fetch story for slug: ${slug}`)
    throw error
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale)),
      [STORY_PROP_NAME]: story,
      hideChat: story.content.hideChat ?? false,
    },
    revalidate: getRevalidate(),
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.SKIP_BUILD_STATIC_GENERATION === 'true') {
    console.info('Skipping static generation for widget landing pages...')
    return { paths: [], fallback: 'blocking' }
  }

  const pageLinks = await getFilteredPageLinks()
  return {
    paths: pageLinks.map((item) => ({ params: { slug: item.slugParts }, locale: item.locale })),
    fallback: 'blocking',
  }
}

export default NextPage
