import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { LayoutWithMenu } from '@/components/LayoutWithMenu/LayoutWithMenu'
import { Page } from '@/components/Page/Page'
import {
  getAllLinks,
  getGlobalStory,
  getStoryBySlug,
  StoryblokPageProps,
  StoryblokQueryParams,
} from '@/services/storyblok/storyblok'

type Path = {
  params: {
    slug: string[]
  }
}

const NextPage: NextPageWithLayout<StoryblokPageProps> = (props: StoryblokPageProps) => {
  return (
    <>
      <Head>
        <title>{props.story.content.name}</title>
      </Head>
      <Page {...props} />
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

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const paths: Path[] = [
    // Index page needs to be added separately, it's not a CMS link
    { params: { slug: [''] } },
  ]
  const links = await getAllLinks()
  Object.keys(links)
    .filter((linkKey) => !links[linkKey].is_folder)
    .filter((linkKey) => !links[linkKey].slug.startsWith('products/'))
    .forEach((linkKey) => {
      const slug = links[linkKey].slug
      const splitSlug = slug.split('/')

      paths.push({ params: { slug: splitSlug } })
    })

  return {
    paths: paths.flatMap((path) =>
      locales.map((locale) => ({
        ...path,
        locale,
      })),
    ),
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
