import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import {
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
  getFilteredPageLinks,
  StoryblokPreviewData,
} from '@/services/storyblok/storyblok'
import { GLOBAL_STORY_PROP_NAME, STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type RoutingPath = {
  params: {
    slug: string[]
  }
  locale?: string
}

const NextPage: NextPageWithLayout<StoryblokPageProps> = (props: StoryblokPageProps) => {
  const story = useStoryblokState(props.story)

  return (
    <>
      <Head>
        <title>{props.story.content.name}</title>
      </Head>
      <StoryblokComponent blok={story.content} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  StoryblokPageProps,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { params, locale, previewData: { version } = {} } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')
  const [story, globalStory, translations] = await Promise.all([
    getStoryBySlug(slug, { version, locale }),
    getGlobalStory({ version, locale }),
    serverSideTranslations(locale),
  ])

  if (story === undefined) {
    console.warn(`Page not found: ${slug}, locale: ${locale}`)
    return { notFound: true }
  }

  return {
    props: {
      ...translations,
      [STORY_PROP_NAME]: story,
      [GLOBAL_STORY_PROP_NAME]: globalStory,
    },
    revalidate: process.env.VERCEL_ENV === 'preview' ? 1 : false,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageLinks = await getFilteredPageLinks()
  const paths: RoutingPath[] = pageLinks.map(({ locale, slugParts }) => {
    return { params: { slug: slugParts }, locale }
  })
  return {
    paths,
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
