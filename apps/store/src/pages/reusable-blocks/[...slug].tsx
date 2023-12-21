import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { getStoryBySlug, ReusableStory, StoryblokQueryParams } from '@/services/storyblok/storyblok'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type ReusableBlockPageProps = {
  story: ReusableStory
}

const NextReusableBlockPage: NextPage<ReusableBlockPageProps> = (props) => {
  const story = useStoryblokState(props.story)
  if (!story) return null

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
  StoryblokQueryParams
> = async (context) => {
  const { locale, params, draftMode } = context
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = (params?.slug ?? []).join('/')

  const story = await getStoryBySlug<ReusableStory>(`/reusable-blocks/${slug}`, {
    locale,
    version: draftMode ? 'draft' : 'published',
  })

  return {
    props: { story },
  }
}

export default NextReusableBlockPage
