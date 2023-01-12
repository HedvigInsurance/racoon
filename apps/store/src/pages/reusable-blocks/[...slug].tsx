import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import {
  getStoryBySlug,
  ReusableStory,
  StoryblokPreviewData,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

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
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  const story = (await getStoryBySlug(`/reusable-blocks/${slug}`, {
    locale,
    version,
  })) as ReusableStory

  return {
    props: {
      story,
    },
  }
}

export default NextReusableBlockPage
