import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { countries } from '@/lib/l10n/countries'
import { routingLocale } from '@/lib/l10n/locales'
import {
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
  getNonProductPageLinks,
} from '@/services/storyblok/storyblok'

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

export const getStaticProps: GetStaticProps<StoryblokPageProps, StoryblokQueryParams> = async (
  context,
) => {
  const { params, preview, locale } = context
  if (!locale || locale === 'default') return { notFound: true }

  const slug = (params?.slug ?? []).join('/')
  const [story, globalStory] = await Promise.all([
    getStoryBySlug(slug, { preview, locale }),
    getGlobalStory({ preview, locale }),
  ])

  if (story === undefined) {
    console.warn(`Page not found: ${slug}, locale: ${locale}`)
    return { notFound: true }
  }

  return { props: { ...(await serverSideTranslations(locale)), story, globalStory } }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageLinks = await getNonProductPageLinks()
  const paths: RoutingPath[] = []
  pageLinks.forEach(({ countryId, slugParts }) => {
    countries[countryId].locales.forEach((locale) => {
      paths.push({ params: { slug: slugParts }, locale: routingLocale(locale) })
    })
  })
  return {
    paths,
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
