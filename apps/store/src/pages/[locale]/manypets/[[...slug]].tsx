import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { STORYBLOK_MANYPETS_FOLDER_SLUG } from '@/features/manyPets/manyPets.constants'
import type { PageStory, StoryblokQueryParams } from '@/services/storyblok/storyblok'
import { getRevalidate, getStoryBySlug } from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { Features } from '@/utils/Features'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'
import { patchNextI18nContext } from '@/utils/patchNextI18nContext'

type PageProps = { story: PageStory }

const ManyPetsCmsPage = ({ story: initialStory }: PageProps) => {
  const story = useStoryblokState(initialStory)
  if (!story) return null

  return (
    <>
      <HeadSeoInfo story={story} />
      <StoryblokComponent blok={story.content} />
      <DefaultDebugDialog />
    </>
  )
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  patchNextI18nContext(context)
  const { locale, params, draftMode } = context

  if (!Features.enabled('MANYPETS_MIGRATION')) return { notFound: true }
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = `${STORYBLOK_MANYPETS_FOLDER_SLUG}/${(params?.slug ?? []).join('/')}`

  const version = draftMode ? 'draft' : 'published'
  const [story, translations] = await Promise.all([
    getStoryBySlug<PageStory>(slug, { version, locale }),
    serverSideTranslations(locale),
  ])

  return {
    props: {
      [STORY_PROP_NAME]: story,
      ...translations,
    },
    revalidate: getRevalidate(),
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
