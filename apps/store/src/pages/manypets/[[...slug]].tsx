import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import {
  getStoryBySlug,
  MANYPETS_FOLDER_SLUG,
  PageStory,
  StoryblokPreviewData,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type PageProps = { story: PageStory }

const ManyPetsCmsPage = ({ story: initialStory }: PageProps) => {
  const story = useStoryblokState(initialStory)

  return (
    <>
      <HeadSeoInfo story={story} />
      <StoryblokComponent blok={story.content} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  StoryblokQueryParams,
  StoryblokPreviewData
> = async (context) => {
  const { locale, params, previewData: { version } = {} } = context

  if (!Features.enabled('MANYPETS_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = `${MANYPETS_FOLDER_SLUG}/${(params?.slug ?? []).join('/')}`

  const pageStory = await getStoryBySlug<PageStory>(slug, { version, locale })
  if (!pageStory) return { notFound: true }

  return {
    props: {
      [STORY_PROP_NAME]: pageStory,
    },
    revalidate: process.env.VERCEL_ENV === 'preview' ? 1 : false,
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  // NOTE: Not pre-building CMS pages yet, we may need it in the future
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default ManyPetsCmsPage
