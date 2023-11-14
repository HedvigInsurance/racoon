import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import {
  PageStory,
  type WidgetFlowStory,
  type StoryblokQueryParams,
  getRevalidate,
  getStoryBySlug,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type PageProps = {
  type: 'content' | 'flow'
  [STORY_PROP_NAME]: PageStory | WidgetFlowStory
  hideChat?: boolean
}

const WidgetCmsPage = (props: PageProps) => {
  // PageStory and WidgetFlowStory are incompatible types but we don't actually care that
  // pros[STORY_PROP_NAME] gets properly typed here.
  const story = useStoryblokState(props[STORY_PROP_NAME] as any)

  if (!story) return null

  return <StoryblokComponent blok={story.content} />
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  const { locale, params, draftMode } = context

  if (!params) throw new Error('Missing params')
  if (!isRoutingLocale(locale)) return { notFound: true }

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/flows/${params.slug.join('/')}`
  const version = draftMode ? 'draft' : undefined

  const [story, translations] = await Promise.all([
    getStoryBySlug<PageStory | WidgetFlowStory>(slug, { version, locale }),
    serverSideTranslations(locale),
  ])

  const props = { ...translations }

  if (isWidgetFlowStory(story)) {
    return {
      props: {
        ...props,
        type: 'flow',
        story,
        hideChat: true,
      },
      revalidate: getRevalidate(),
    }
  }

  return {
    props: {
      ...props,
      type: 'content',
      story,
      hideChat: story.content.hideChat ?? true,
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

export default WidgetCmsPage
