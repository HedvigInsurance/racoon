import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { countries } from '@/lib/l10n/countries'
import { CountryLabel } from '@/lib/l10n/types'
import {
  getAllLinks,
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
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

  const slug = params?.slug ? params.slug.join('/') : 'home'
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
  const links = await getAllLinks()
  const paths: RoutingPath[] = []
  Object.values(links)
    .filter((link) => !link.is_folder)
    .filter((link) => !link.slug.includes('/products/') && !link.slug.endsWith('/global'))
    .forEach((link) => {
      const [countryCode, ...slug] = link.slug.split('/')
      const country = countries[countryCode as CountryLabel]
      if (!country) {
        return
      }
      if (slug.length === 1 && slug[0] === 'home') {
        slug[0] = ''
      }
      country.locales.forEach((locale) => {
        // We use en-SE ISO format for settings but downcase it for routing to get nicer URLs
        const routingLocale = locale.toLowerCase()
        paths.push({ params: { slug }, locale: routingLocale })
      })
    })
  return {
    paths,
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
