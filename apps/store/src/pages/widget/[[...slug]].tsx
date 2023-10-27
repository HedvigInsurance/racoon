import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { STORYBLOK_WIDGET_FOLDER_SLUG } from '@/features/widget/widget.constants'
import {
  PageStory,
  WidgetFlowStory,
  StoryblokQueryParams,
  getRevalidate,
  getStoryBySlug,
} from '@/services/storyblok/storyblok'
import { STORY_PROP_NAME } from '@/services/storyblok/Storyblok.constant'
import { isWidgetFlowStory } from '@/services/storyblok/Storyblok.helpers'
import { isRoutingLocale } from '@/utils/l10n/localeUtils'

type NextWidgetContentPageProps = {
  type: 'content'
  [STORY_PROP_NAME]: PageStory
  hideChat?: boolean
}

type NextWidgetFlowPageProps = {
  type: 'flow'
  [STORY_PROP_NAME]: WidgetFlowStory
  hideChat: true
}

type PageProps = NextWidgetContentPageProps | NextWidgetFlowPageProps

const WidgetCmsPage = (props: PageProps) => {
  if (props.type === 'flow') {
    return <NextWidgetFlowPage {...props} />
  }

  return <NextWidgetContentPage {...props} />
}

const NextWidgetFlowPage = (props: NextWidgetFlowPageProps) => {
  const story = useStoryblokState(props[STORY_PROP_NAME])

  if (!story) {
    return null
  }

  return <StoryblokComponent blok={story.content} />
}

const NextWidgetContentPage = (props: NextWidgetContentPageProps) => {
  const story = useStoryblokState(props[STORY_PROP_NAME])

  if (!story) {
    return null
  }

  return <StoryblokComponent blok={story.content} />
}

export const getStaticProps: GetStaticProps<PageProps, StoryblokQueryParams> = async (context) => {
  const { locale, params, draftMode } = context

  if (!isRoutingLocale(locale)) {
    return { notFound: true }
  }

  const slug = `${STORYBLOK_WIDGET_FOLDER_SLUG}/${(params?.slug ?? []).join('/')}`
  const version = draftMode ? 'draft' : 'published'

  const [story, translations] = await Promise.all([
    getStoryBySlug<PageStory | WidgetFlowStory>(slug, { version, locale }),
    serverSideTranslations(locale),
  ])

  const props = {
    ...translations,
  }

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
