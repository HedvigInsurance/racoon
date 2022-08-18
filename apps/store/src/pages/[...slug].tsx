import type { GetStaticPaths, GetStaticProps, NextPageWithLayout } from 'next'
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

export const getStaticProps: GetStaticProps<StoryblokPageProps, StoryblokQueryParams> = async ({
  params,
  preview,
}) => {
  const slug = params?.slug ? params.slug.join('/') : 'home'
  const [story, globalStory] = await Promise.all([
    getStoryBySlug(slug, preview),
    getGlobalStory(preview),
  ])

  return {
    props: {
      story: story ?? false,
      globalStory: globalStory ?? false,
      key: story ? story.id : false,
      preview: preview || false,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await getAllLinks()

  const paths: Path[] = []
  Object.keys(links)
    .filter((linkKey) => !links[linkKey].is_folder)
    .filter((linkKey) => !links[linkKey].slug.startsWith('products/'))
    .forEach((linkKey) => {
      const slug = links[linkKey].slug
      const splittedSlug = slug.split('/')

      paths.push({ params: { slug: splittedSlug } })
    })

  return {
    paths: paths,
    fallback: false,
  }
}

NextPage.getLayout = (children) => <LayoutWithMenu>{children}</LayoutWithMenu>

export default NextPage
