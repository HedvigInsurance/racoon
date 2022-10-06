import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { isRoutingLocale } from '@/lib/l10n/localeUtils'
import {
  getStoryBySlug,
  ReusableStory,
  StoryblokPreviewData,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'

type ReusableBlockPageProps = {
  story: ReusableStory
}

const NextReusableBlockPage: NextPage<ReusableBlockPageProps> = (props) => {
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

export const getServerSideProps: GetServerSideProps<
  ReusableBlockPageProps,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { locale, params, previewData: { version } = {} } = context
  const slug = (params?.slug ?? []).join('/')

  if (typeof slug !== 'string') return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const story = await getStoryBySlug(`/reusable-blocks/${slug}`, { locale, version })

  if (story === undefined) {
    console.warn(`Page not found: /reusable-blocks/${slug}, locale: ${locale}`)
    return { notFound: true }
  }

  return {
    props: {
      story,
    },
  }
}

export default NextReusableBlockPage
